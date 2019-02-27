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
import json
import pathlib
import sys

from collections import defaultdict
from slugify import slugify

from constants import DISCOGS_GENRES
from models import Genre, Album
from utils import CustomEncoder


def get_audio_filenames(filepath):
    filenames = {}
    p = pathlib.Path(filepath)

    for f in p.glob('**/*.mp3'):
        if '_' in f.name:
            filenames[f.name.split('_')[0]] = f.name

    return filenames


def get_data(args, filenames):
    data = defaultdict(Genre)
    with open(args.source) as fin:
        reader = csv.DictReader(fin, delimiter='\t', quoting=csv.QUOTE_NONE)
        for row in reader:
            catalog_id = row['sd_id']
            artist = row['dc_artist']
            title = row['dc_title']
            released = row['dc_year']
            decade = row['dc_decade'] + "'s"
            genres = row['dc_genres']
            genres = [g.strip() for g in genres.strip().split(';')]
            styles = row['dc_styles']
            styles = [s.strip() for s in styles.strip().split(';') if s]

            for genre in genres:
                genre_slug = slugify(genre)
                genre_styles = DISCOGS_GENRES[genre]
                data[genre_slug].name = genre
                data[genre_slug].slug = genre_slug
                data[genre_slug].count += 1
                for style in styles:
                    if style in genre_styles:
                        style_slug = slugify(style)
                        data[genre_slug].styles[style_slug].name = style
                        data[genre_slug].styles[style_slug].slug = style_slug
                        data[genre_slug].styles[style_slug].count += 1
                        data[genre_slug].styles[style_slug].decades[decade].name = decade  # noqa
                        data[genre_slug].styles[style_slug].decades[decade].count += 1  # noqa

                        audio_filepath = filenames.get(catalog_id)
                        album = Album(
                            catalog_id, title, released, artist, audio_filepath
                        )

                        data[genre_slug].styles[style_slug].decades[decade].albums.append(album)  # noqa
    return data


def main():
    parser = argparse.ArgumentParser(
        description='Work with data used in the HBLL Music Exhibit.'
    )
    parser.add_argument('action', type=str, help='Action to run')
    parser.add_argument(
        'source', type=str, help='Filepath to source data file'
    )
    parser.add_argument(
        'audio', type=str, help='Filepath to audio file directory'
    )

    if len(sys.argv) == 1:
        parser.print_help()
        return

    args = parser.parse_args()
    if args.action in ['getdata', 'export', 'extract']:
        filenames = get_audio_filenames(args.audio)
        data = get_data(args, filenames)
        with open('musicviz.json', 'w') as fout:
            fout.write(json.dumps(data, cls=CustomEncoder, indent=4))


if __name__ == '__main__':
    main()
