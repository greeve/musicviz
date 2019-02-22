"""
sd_id
dc_artist
dc_title
dc_year
dc_decade
dc_genres
dc_styles
"""
import argparse
import csv
import sys


def main():
    parser = argparse.ArgumentParser(
        description='Work with data used in the HBLL Music Exhibit.'
    )
    parser.add_argument('action', type=str, help='Action to run')
    group = parser.add_mutually_exclusive_group()
    group.add_argument(
        '-f', '--filepath', type=str, help='Path of a file to open'
    )

    if len(sys.argv) == 1:
        parser.print_help()
        return

    args = parser.parse_args()
    if args.action == 'getdata' and args.filepath:
        with open(args.filepath) as fin:
            reader = csv.DictReader(
                fin, delimiter='\t', quoting=csv.QUOTE_NONE
            )
            print(reader.fieldnames)
            for row in reader:
                oid = row['sd_id']
                artist = row['dc_artist']
                title = row['dc_title']
                year = row['dc_year']
                decade = row['dc_decade'] + "'s"
                genres = row['dc_genres']
                styles = row['dc_styles']

                item = {
                    'oid': oid,
                    'artist': artist,
                    'title': title,
                    'year': year,
                    'decade': decade,
                    'genres': genres,
                    'styles': styles,
                }
                # print(item)
                print(genres)


if __name__ == '__main__':
    main()
