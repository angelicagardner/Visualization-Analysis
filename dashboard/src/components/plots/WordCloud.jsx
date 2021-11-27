import { useEffect, useState } from 'react';
import { DataService } from '../../services/data-service';
import ReactWordCloud from 'react-wordcloud';
import 'd3-transition';
import { select } from 'd3-selection';
import 'tippy.js/dist/tippy.css';
import { motion, AnimatePresence } from 'framer-motion';

const options = {
  enableTooltip: true,
  deterministic: false,
  fontFamily: 'impact',
  fontSizes: [5, 60],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 3,
  rotationAngles: [-60, 60],
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
          window.open(`https://google.com/?q=${word.text}`, '_blank');
        }
      })
      .transition()
      .attr('background', 'white');
  };
}

const callbacks = {
  getWordColor: (word) => (word.value > 300 ? '#94B6E2' : '#E2C094'),
  getWordTooltip: (word) =>
    `The word "${word.text}" appears ${word.value} times.`,
  onWordClick: getCallback('onWordClick'),
  onWordMouseOut: getCallback('onWordMouseOut'),
  onWordMouseOver: getCallback('onWordMouseOver'),
};

function WordCloud({ layout, data }) {
  const [words, setWords] = useState([]);

  useEffect(() => {
    setWords(data);
  }, [data]);

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
