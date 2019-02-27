from collections import defaultdict
from slugify import slugify


class Album:

    def __init__(self, catalog_id, title, released, artists, audio_filepath):
        self.catalog_id = catalog_id
        self.title = title
        self.released = released
        self.artists = artists
        self.audio_filepath = audio_filepath

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
