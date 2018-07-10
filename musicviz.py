"""
A python module to format the Discogs data for display in a web browser.

catId
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
from slugify import slugify

from constants import DISCOGS_GENRES


class Album:

    def __init__(self, catalog_id, title, released, artists):
        self.catalog_id = catalog_id
        self.title = title
        self.released = released
        self.artists = artists

    def __repr__(self):
        return 'Album({}, {}, {}, {})'.format(
            self.catalog_id,
            self.title,
            self.released,
            self.artists,
        )


class Decade:

    def __init__(self, name='', count=0, albums=None):
        self.name = name
        self.count = count
        self.albums = albums if albums else []

    def __repr__(self):
        return 'Decade(name={}, count={}, albums={})'.format(
            self.name,
            self.count,
            self.albums,
        )


class Style:

    def __init__(self, name='', count=0, decades=None):
        self.name = name
        self.slug = slugify(name)
        self.count = count
        self.decades = decades if decades else defaultdict(Decade)

    def __repr__(self):
        return 'Style(name={}, count={}, decades={})'.format(
            self.name,
            self.count,
            self.decades,
        )


class Genre:

    def __init__(self, name='', count=0, styles=None):
        self.name = name
        self.slug = slugify(name)
        self.count = count
        self.styles = styles if styles else defaultdict(Style)

    def __repr__(self):
        return 'Genre(name={}, count={}, styles={})'.format(
            self.name,
            self.count,
            self.styles,
        )


class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        return obj.__dict__


class SetEncoder(json.JSONEncoder):

    def default(self, obj):
        if isinstance(obj, set):
            return list(obj)
        return json.JSONEncoder.default(self, obj)


def get_unique_styles(genre, styles):
    s = defaultdict(Style)

    return s


def get_unique_genres(filepath):
    g = defaultdict(Genre)

    with open(filepath) as fin:
        reader = csv.DictReader(fin, delimiter='\t')
        for row in reader:
            genres = row['genres']
            genres = genres.strip().split(';')
            styles = row['styles']
            styles = [s for s in styles.strip().split(';') if s]
            decade = row['decade']
            catalog_id = row['catId']
            title = row['catTitle']
            released = row['released']
            artists = row['artists']
            for genre in genres:
                genre_slug = slugify(genre)
                genre_styles = DISCOGS_GENRES[genre]
                g[genre_slug].name = genre
                g[genre_slug].slug = genre_slug
                g[genre_slug].count += 1
                for style in styles:
                    if style in genre_styles:
                        style_slug = slugify(style)
                        g[genre_slug].styles[style_slug].name = style
                        g[genre_slug].styles[style_slug].slug = style_slug
                        g[genre_slug].styles[style_slug].count += 1
                        g[genre_slug].styles[style_slug].decades[decade].name = decade  # noqa
                        g[genre_slug].styles[style_slug].decades[decade].count += 1  # noqa
                        g[genre_slug].styles[style_slug].decades[decade].albums.append(Album(catalog_id, title, released, artists))  # noqa

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
        with open('musicviz.json', 'w') as fout:
            fout.write(json.dumps(genres, cls=CustomEncoder))

        genres_output = [{'slug': k, 'name': v.name, 'count': v.count} for k, v in genres.items()]  # noqa
        with open('genres.json', 'w') as fout:
            fout.write(json.dumps(genres_output))

        lines = []
        lines.append('\t'.join(('slug', 'name', 'count')))
        lines.extend(
            ['\t'.join((k, v.name, str(v.count))) for k, v in genres.items()],
        )
        print('\n'.join(lines))
    if args.action == 'decades' and args.filepath:
        decades = get_decades(args.filepath)
        print(decades)


if __name__ == '__main__':
    main()
