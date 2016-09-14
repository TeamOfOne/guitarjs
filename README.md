[![Stories in Ready](https://badge.waffle.io/TeamOfOne/psc16-team33.png?label=ready&title=Ready)](https://waffle.io/TeamOfOne/psc16-team33)
## Smart Guitar

> *Interactive creating, editing, playing and sharing guitar scores in the browser*

This project aims to provide a platform for guitar beginners and experts alike to create interactive chord diagrams that can be easily edited, played, shared, and saved locally.

The core features and project goals are:
- [x] **Interactive** chord diagrams:

    while there are lots of great libraries for generating beautiful guitar chord diagrams
    (and even more advanced notation) on a web page,
    we felt that these diagrams were lacking a crucial feature of the musical experience: experimentation!
    So we set up to create a similar app that allowed people to actually *play* with the chords,
    trying out variations, and learning about how chords relate to each other.

- [x] **Bi-directional** conversion between chord diagrams and chord names:\*

    There is a huge gap between different degrees of musical expertise,
    and we feel that the barriers of progression between them are unnecessarily high.
    Lots of chord identification and conversion tools actually use hardcoded databases of notes to achieve this,
    but we feel that using the actual harmonic rules that define the structure of chords
    does better justice to the beauty of the musical theory
    behind the apparent unpredictability of note names and symbols.

- [x] **Sample-free** sound synthesis (chord playback):

    While dynamic synthesis may produce poor results in naive implementations, 
    more advanced algorithms can produce a quite realistic sound.
    In the spirit of both highlighting the math behind music and sound,
    and producing an app that doesn't depend on a huge set of samples
    we decided to use one such algorythic synthesis methods,
    particularly the Karplus-Strong.

- [ ] **Share via URL** / rebuild score from URL:

    One of the main goals of the project is to allow people to share in the joy of music,
    and to communicate through barriers of musical knowledge,
    so what better way to do this than allow quick sharing by just copying the URL of the page?
    The idea is that the chords would then be reconstructed on the other side using the data in the URL.
    This feature is upcoming, so the format isn't set in stone, but it could look like this:
    `http://smartguitar.org?n=Am,Bm7,C...`

- [ ] **Save to a local file**:\*

    It wouldn't be very useful if chords and scores introduced in the platform were only accessible through it.
    With that in mind, we intend to allow exporting a chord in as many different formats as possible,
    starting with the simple ones (simple image, svg file or pdf document),
    but eventually progressing to more advanced notations like tabs and classical scores,
    as well as established formats used by music-centered programs.
    At the moment, only exporting individual chords to images is supported.
    
\* - *work in progress*

## License

All code in this project, except the third-party libraries, which have their own licenses,
is released under the ISC license. See the LICENSE.txt file for details.

## Acknowledgements

We owe a huge debt of gratitude to previous work done by music and programming enthusiasts
who not only built brilliant apps and tools, but provided the source for all to use and build upon.
Among several others, we'd like to highlight the following:

- [VexChords](http://www.vexflow.com/vexchords/),
  an open-source JS+HTML5 Guitar chord generator,
  for showcasing the possibilities of musical notation on the web
- [GuitarJs](http://naiquevin.github.io/GuitarJs/),
  a javascript library to work with guitar notes and chords (text-only),
  for powering the chordname-to-diagram translation
- [MUSIQ.js](https://github.com/studioludens/musiqjs/),
  a javascript library to work with note, chord and scale recognition and calculation
  for powering the diagram-to-chordname translation
- [JavaScript Karplus-Strong](http://amid.fish/javascript-karplus-strong),
  a HTML5 port of the
  [Karplus-Strong guitar synthesizer](http://lab.andre-michelle.com/karplus-strong-guitar)
  originally written in ActionScript,
  for powering the sound synthesis and reproduction
- Wikipedia's articles on [Chord](https://en.wikipedia.org/wiki/Chord_(music)#Tabular_notation) and
  [Chord names and symbols](https://en.wikipedia.org/wiki/Chord_names_and_symbols_(popular_music)),
  for the detailed information about the structure of chords and the rules that underlie their naming system
