import { useEffect, useState } from 'react';
import ReactWordCloud from 'react-wordcloud';
import 'd3-transition';
import { select } from 'd3-selection';
import 'tippy.js/dist/tippy.css';
import { motion, AnimatePresence } from 'framer-motion';

const options = {
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [8, 100],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 0,
  rotations: 3,
  rotationAngles: [-45, 45],
  scale: 'sqrt',
  spiral: 'archimedean',
  transitionDuration: 500,
};

function getCallback(callback) {
  return function (word, event) {
    const isActive = callback !== 'onWordMouseOut';
    const element = event.target;
    const text = select(element);
    text
      .on('click', () => {
        if (isActive) {
          // window.open(`https://google.com/?q=${word.text}`, '_blank');
        }
      })
      .transition()
      .attr('background', 'white');
  };
}

function WordCloud({ layout, data }) {
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(data.sort((a, b) => b.value - a.value));
  }, [data]);

  const q1 = words[3]?.value ?? 0;
  const q2 = words[8]?.value ?? 0;
  const q3 = words[12]?.value ?? 0;

  const callbacks = {
    getWordColor: (word) => {
      if (word.value > q1) return '#ffff';
      if (word.value > q2) return '#fffb';
      if (word.value > q3) return '#fff9';
      return '#fff6';
    },
    getWordTooltip: (word) =>
      `The word "${word.text}" appears ${word.value} times.`,
    onWordClick: getCallback('onWordClick'),
    onWordMouseOut: getCallback('onWordMouseOut'),
    onWordMouseOver: getCallback('onWordMouseOver'),
  };

  return (
    <AnimatePresence exitBeforeEnter>
      {layout.wordCloud.visible ? (
        <div className="word-clouds" key="cloud">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ReactWordCloud
              callbacks={callbacks}
              options={options}
              words={words}
            />
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export default WordCloud;
