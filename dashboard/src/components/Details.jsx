import RidgeLine from './plots/Ridgeline';
import { motion, AnimatePresence } from 'framer-motion';
import MessageTable from './MessageTable';
function Details({ layout }) {
  return (
    <AnimatePresence exitBeforeEnter>
      {layout.details.visible ? (
        <motion.div
          className="details"
          key="details"
          initial={{ left: '120vw' }}
          animate={{ left: '40vw' }}
          exit={{ left: '120vw' }}
          transition={{ duration: 0.7 }}
        >
          <RidgeLine />
          <MessageTable />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Details;
