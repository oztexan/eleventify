const moo = require('moo');

const mosttext = /[^#{[|\n]+/;
const mosttabtext = /[^\n]+/;

const norm = {
  title: 't',
  subtitle: 'st',
  comment: 'c',
  end_of_tab: 'eot',
  start_of_tab: 'sot'
};

const abbdir = t => {
  t = t.trim().toLowerCase();
  return norm[t] ? norm[t] : t;
};


const lexer = moo.states({
  main: {
    myError: moo.error,
    comment_start: {
      match: /^\s*#/,
      next: 'comment',
      value: () => null
    },
    directive_start: {
      //      match: /^\s*\{/,
      match: /\s*\{/,
      push: 'directive',
      value: () => null
    },
    chord_start: {
      match: /\[/,
      push: 'chord',
      value: () => null
    },
    measure: {
      match: /\|/,
      //        value: x => null
    },
    lyric: mosttext,
    //     lyric:  /\w+/,
    WS: {
      match: /[ \t]+/,
      //      value: x => null
    },
    NL: {
      match: /\n/,
      lineBreaks: true,
      value: () => 'newline'
    },
    //     pdirective:   {match: /\s*\{\s*(\w*)\s*:\s*([\s|\S]*?)\s*\}/, push: 'pdirective'},
  },
  directive: {
    myError: moo.error,
    soc: {
      match: /\s*(?:[sS][oO][cC]|[sS][tT][aA][rR][tT]_[oO][fF]_[cC][hH][oO][rR][uU][sS])\s*}/,
      value: () => 'soc',
      next: 'chorus',
    },
    define: {
      match: /\s*(?:[dD][eE][fF][iI][nN][eE]|[cC][hH][oO][rR][dD])\s*/,
      next: 'define',
    },
    sov: {
      match: /\s*(?:[sS][oO][vV]|[sS][tT][aA][rR][tT][_][oO][fF][_][vV][eE][rR][sS][eE])\s*}/,
      value: () => 'sov',
      next: 'verse',
    },
    sot: {
      match: /\s*(?:[sS][oO][tT]|[sS][tT][aA][rR][tT][_][oO][fF][_][tT][aA][bB])\s*}/,
      value: () => 'sot',
      next: 'tablature',
    },
    sog: {
      match: /\s*(?:[sS][oO][gG]|[sS][tT][aA][rR][tT][_][oO][fF][_][gG][rR][iI][dD])\s*}/,
      value: () => 'sog',
      next: 'grid',
    },
    directive: {
      match: /[^:}\n]+/,
      value: x => abbdir(x)
    },
    value: {
      match: /:[^}\n]*/,
      value: x => x.replace(':', '').trim()
    },
    directive_end: {
      match: /[}|\n]+/,
      pop: true,
      lineBreaks: true,
      //      value: x => null
    }
  },
  tablature: {
    myError: moo.error,
    NL: {
      match: /[}|\n]/,
      lineBreaks: true
    },
    eot: {
      match: /{\s*[eE][oO][tT]\s*}/,
      pop: true,
      lineBreaks: true,
    },
    end_of_tab: {
      match: /{\s*[eE][nN][dD][_][oO][fF][_][tT][aA][bB]\s*}/,
      value: () => 'eot',
      pop: true,
      lineBreaks: true,
    },
    tabline: {
      match: mosttabtext,
      lineBreaks: true
    }
  },
  grid: {
    myError: moo.error,
    NL: {
      match: /[}|\n]/,
      lineBreaks: true
    },
    eog: {
      match: /{\s*[eE][oO][gG]\s*}/,
      pop: true,
      lineBreaks: true,
    },
    end_of_grid: {
      match: /{\s*[eE][nN][dD][_][oO][fF][_][gG][rR][iI][dD]\s*}/,
      value: () => 'eog',
      pop: true,
      lineBreaks: true,
    },
    tabline: {
      match: mosttabtext,
      lineBreaks: true
    }
  },
  chorus: {
    myError: moo.error,
    NL: {
      match: /[}|\n]/,
      lineBreaks: true
    },
    eoc: {
      match: /{\s*[eE][oO][cC]\s*}/,
      pop: true,
      lineBreaks: true,
    },
    end_of_chorus: {
      match: /{\s*[eE][nN][dD][_][oO][fF][_][cC][hH][oO][rR][uU][sS]\s*}/,
      value: () => 'eoc',
      pop: true,
      lineBreaks: true,
    },
    lyricline: {
      match: mosttext,
      lineBreaks: true
    }
  },
  verse: {
    myError: moo.error,
    NL: {
      match: /[}|\n]/,
      lineBreaks: true
    },
    end_of_verse: {
      match: /{\s*[eE][nN][dD][_][oO][fF][_][vV][eE][rR][sS][eE]\s*}/,
      value: () => 'eov',
      pop: true,
      lineBreaks: true,
    },
    tabline: {
      match: mosttext,
      lineBreaks: true
    }
  },
  chord: {
    myError: moo.error,
    chord: {
      match: /[^\]\n]+/,
      //    match: /(?:[A-Ga-g])(?:#|[bB])?(?:[dD][iI][mM]|[mM][aA][jJ]|[sS][uU][sS]|[mM])?\d*(?:\/[A-Ga-g][#|[bB]]?)?/,
      value: x => x.trim()
    },
    /*      nashville: {
          match: /(?:[A-Ga-g])(?:#|[bB])?(?:[mM]|[dD][iI][mM]|[mM][aA][jJ]|[sS][uU][sS])?\d*(?:\/[A-Ga-g][#|[bB]]?)/,
          value: x => x.trim()
        },
    */
    chord_end: {
      match: /\]/,
      //      match: /\][^[\n]*/,  If in Chord sheet format
      pop: true,
      value: () => null
    }
  },
  // {define: E5 base-fret 7 frets 0 1 3 3 x x fingers - 1 2 3 - -}
  define: {
    myError: moo.error,
    chord: {
      match: /:\s*\S+\s*/,
      value: x => x.replace(':', '').trim()
    },
    base_fret: {
      match: /[bB][aA][sS][eE][-][fF][rR][eE][tT]\s*\d+\s*/,
      value: x => x.trim()
    },
    frets: {
      match: /[fF][rR][eE][tT][sS](?:\s*(?:\d|x|-|o)+\s*)*/,
      value: x => x.trim()
    },
    fingers: {
      match: /[fF][iI][nN][gG][eE][rR][sS](?:\s*(?:\d|-)+\s*)*/,
      value: x => x.trim()
    },
    NL: {
      match: /[}|\n]/,
      next: 'main',
      lineBreaks: true,
      value: () => 'define_end'
    }
  },
  comment: {
    myError: moo.error,
    comment: {
      match: mosttext,
      value: x => x.trim()
    },
    NL: {
      match: /\n/,
      lineBreaks: true,
      next: 'main'
    }
  }
});

const html = token => {
  const t = token.children && Array.isArray(token.children) && token.length > 0 ?
    token.children.reduce((tot, t) => tot += ' ' + t.value) :
    '';
  switch (token.type) {
    case 'directive':
      return `<span class='directive ${abbdir(token.value)}_directive'>${t}</span><BR>`;

    case 'chordline':
      return `<span class='chordline'>${t}</span><BR>`;

    case 'lyricline':
      return `<span class='lyricline'>${t}</span><BR>`;

    case 'NL':
      return `<BR>`;

    default:
      return `<span class='basic'>${token.value}</span><BR>`;
  }
};

const parse = (chordpro, transform) => {
  lexer.reset(chordpro);

  if (!transform) transform = t => t;
  let rawtokens = Array.from(lexer);
  // console.log(JSON.stringify(rawtokens,null,2));

  let parent = null;
  let parents = [];
  let chordline = null;
  let lyricline = null;

  let valuetokens = rawtokens.filter(t => t.value);
  // console.log(JSON.stringify(valuetokens,null,2));

  //compress and transform chordlines and lyric lines
  let pipe = [];
  valuetokens.forEach(t => {
    //    console.log(JSON.stringify(t),':',JSON.stringify(parent));
    if (t.type === 'directive' ||
      t.type === 'soc' ||
      t.type === 'sov' ||
      t.type === 'sot' ||
      t.type === 'sog' ||
      t.type === 'comment' ||
      t.type === 'define') {
      parent = t;
      parents.push(t);
      parent.children = [];
    } else if (t.type === 'NL' || t.type === 'directive_end') {
      if (!(parent || chordline || lyricline)) {
        pipe.push(transform(t));
      } else {
        if (chordline) {
          pipe.push(transform(chordline));
          chordline = null;
        }
        if (lyricline) {
          pipe.push(transform(lyricline));
          lyricline = null;
        }
        if (parent && !(parent.type === 'sot' ||
          parent.type === 'sog' ||
          parent.type === 'soc' ||
          parent.type === 'sov')) {
          pipe.push(transform(parent));
          parents.pop();
          parent = parents.length ? parents[parents.length - 1] : null;
        }
      }
    } else if (t.type === 'chord' || t.type === 'measure') {
      if (!chordline) {
        chordline = {
          type: 'chordline',
          value: 'chordline',
          children: []
        };
      }
      //          const dt = chordline ? t.col - chordline.length : t.col;
      //          const td = dt >= 2 ? " ".repeat(dt-1) + t.value : t.value;
      chordline.children.push(t);
    } else if (t.type === 'lyric') {
      if (!lyricline) {
        lyricline = {
          type: 'lyricline',
          value: 'lyricline',
          children: []
        };
      }
      lyricline.children.push(t);
    } else if (parent) {
      parent.children.push(t);
      if (t.type === 'eot' ||
        t.type === 'eog' ||
        t.type === 'eoc' ||
        t.type === 'eov') {
        parent.children.pop();
        pipe.push(parent);
        parents.pop();
        parent = parents.length ? parents[parents.length - 1] : null;
      }
    } else {
      pipe.push(transform(t));
    }
  });

  const pushWell = line => {
    if (line) {
      if (parent) {
        parent.children.push(transform(line));
      } else {
        pipe.push(transform(line));
      }
    }
    return null;
  }

  for (let i = parents.length - 1; i >= 1; i--) {
    parents[i - 1].children.push(parents[i]);
    parent = parents[i - 1];
  }
  chordline = pushWell(chordline);
  lyricline = pushWell(lyricline);
  /*
    if (chordline) {
      pipe.push(transform(chordline));
      chordline = null;
    }
    if (lyricline) {
      pipe.push(transform(lyricline));
      lyricline = null;
    }
    */
  if (parent && !(parent.type === 'sot' ||
    parent.type === 'sog' ||
    parent.type === 'soc' ||
    parent.type === 'sov')) {
    pipe.push(transform(parent));
    parents.pop();
    parent = parents.length ? parents[parents.length - 1] : null;
  }

  return { pipe: pipe, valuetokens: valuetokens };
};

const css = `
<style>
.t_directive {
    font-size: 40;
}
.st_directive {
    font-size: 30;
}
.c_directive {
    font-size: 20;
}
.chordline {
    font-size: 10;
}
.lyricline {
    font-size: 15;
}
</style>
`;


module.exports = function (source) {
  const p = parse(source);
  const value = {
    //    html: css + parse(source, html).pipe.join('\n'),
    parseResult: p.pipe,
    valueTokens: p.valuetokens
  };
  return value;
}
/*
module.exports = (source) => {
  return { html: css+parse(source,html).join('\n'),
           parseResult: parse(source) };
};*/
