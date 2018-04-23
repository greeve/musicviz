"""
A python module to format the Discogs data for display in a web browser.

catTitle
released
artists
genres
styles

decade = released[:3] + '0'
"""
import argparse
import csv
import json
import sys

from collections import defaultdict


def get_unique_genres(filepath):
    g = defaultdict(lambda: defaultdict(int))

    with open(filepath) as fin:
        reader = csv.DictReader(fin, delimiter='\t')
        for row in reader:
            genres = row['genres']
            genres = genres.strip().split(';')
            for genre in genres:
                g[genre]['count'] += 1

    return g


def get_decades(filepath):
    d = defaultdict(lambda: defaultdict(int))

    with open(filepath) as fin:
        reader = csv.DictReader(fin, delimiter='\t')
        for row in reader:
            decade = row['decade']
            d[decade]['count'] += 1

    return d


def generate_data(filepath):
    genres = get_unique_genres(filepath)
    print(genres)
    decades = get_decades(filepath)
    print(decades)


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
    if args.action == 'genres' and args.filepath:
        genres = get_unique_genres(args.filepath)
        print(json.dumps(genres))
        print()
        print([{'name': k, 'count': v['count']} for k, v in genres.items()])
        print()
        lines = []
        lines.append('\t'.join(('name', 'count')))
        lines.extend(['\t'.join((k, str(v['count']))) for k, v in genres.items()])
        print('\n'.join(lines))
    if args.action == 'decades' and args.filepath:
        decades = get_decades(args.filepath)
        print(decades)


if __name__ == '__main__':
    main()
