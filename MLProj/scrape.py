import os
import requests
import xml.etree.ElementTree as ET

BASE_DM   = "https://hrc.contentdm.oclc.org/digital/bl/dmwebservices/index.php"
BASE_DL   = "https://hrc.contentdm.oclc.org/digital/api/collection"
COLLECTION = "p15878coll6"

# Grab pointer, filename, format and filetype for every record in the collection
ALL_QUERY = (
    f"dmQuery/{COLLECTION}/0/"
    "pointer!find!format!filetype/"
    "nosort/"
    "10000/1/0/1/0/0/0/"
    "json"
)

def get_all_records():
    resp = requests.get(BASE_DM, params={'q': ALL_QUERY})
    resp.raise_for_status()
    data = resp.json()
    # records can live under "records" or inside "dmQuery"
    return data.get('records') or data.get('dmQuery', {}).get('records', [])

def get_poster_records():
    all_recs = get_all_records()
    posters = [r for r in all_recs if r.get('format') == 'Posters']
    print(f"→ Found {len(posters)} Posters out of {len(all_recs)} total records")
    return posters

def get_compound_children(pid):
    """Given a CPD pointer, return its child pointers."""
    q = f"dmGetCompoundObjectInfo/{COLLECTION}/{pid}/xml"
    resp = requests.get(BASE_DM, params={'q': q})
    resp.raise_for_status()
    root = ET.fromstring(resp.text)
    kids = [
        p.text.strip()
        for p in root.findall('.//pointer')
        if p.text and p.text.strip() != pid
    ]
    return kids

def download_native(pointer):
    """
    Hits the /download endpoint for that pointer and streams the JPEG.
    """
    dl_url = f"{BASE_DL}/{COLLECTION}/id/{pointer}/download"
    r = requests.get(dl_url, stream=True)
    r.raise_for_status()

    # Try to get the filename from Content-Disposition; fallback to pointer.jpg
    cd = r.headers.get('Content-Disposition','')
    if 'filename=' in cd:
        fname = cd.split('filename=')[-1].strip('" ')
    else:
        fname = f"{pointer}.jpg"

    dest = os.path.join('images', fname)
    if os.path.exists(dest):
        print(f"  ✓ Already have {fname}")
        return

    print(f"  ↓ Downloading {fname}")
    with open(dest, 'wb') as f:
        for chunk in r.iter_content(8192):
            f.write(chunk)

def main():
    os.makedirs('images', exist_ok=True)
    posters = get_poster_records()

    for rec in posters:
        # rec['pointer'] is empty for CPDs, rec['find'] holds e.g. "1728.cpd"
        ptr = rec.get('pointer') or rec.get('find','').split('.',1)[0]

        if rec.get('filetype') == 'cpd':
            print(f"  → compound {ptr}")
            kids = get_compound_children(ptr)
            if not kids:
                print(f"    ! no children for CPD {ptr}")
            for child in kids:
                download_native(child)
        else:
            download_native(ptr)

    print("🏁 All done!")

if __name__ == '__main__':
    main()

