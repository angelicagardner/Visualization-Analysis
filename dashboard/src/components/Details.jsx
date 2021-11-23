import RidgeLine from './plots/Ridgeline';
import { motion, AnimatePresence } from 'framer-motion';
import MessageTable from './MessageTable';
import { DataService } from '../services/data-service';

function Details({ layout, data }) {
  const messages = DataService.getFilteredMessages(data, [
    { name: 'location', type: 'eq', value: 'downtown' },
  ]);
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
          <RidgeLine data={messages} />
          <MessageTable data={messages} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Details;
