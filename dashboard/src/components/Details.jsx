import RidgeLine from './plots/Ridgeline';
import { motion, AnimatePresence } from 'framer-motion';
function Details({ layout }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {layout.details.visible ? (
        <motion.div
          className="details"
          key="details"
          initial={{ left: '120vw' }}
          animate={{ left: '50vw' }}
          exit={{ left: '120vw' }}
          transition={{ duration: 0.7 }}
        >
          <RidgeLine />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Details;
