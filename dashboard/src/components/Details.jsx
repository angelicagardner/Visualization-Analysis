import RidgeLine from './plots/Ridgeline';
import { motion, AnimatePresence } from 'framer-motion';
import MessageTable from './MessageTable';

function Details({
  layout,
  data,
  location,
  update,
  sortingOrder,
  searchQuery,
}) {
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
          <MessageTable
            sortingOrder={sortingOrder}
            searchQuery={searchQuery}
            data={data}
            update={update}
            itemPerRow="500"
          />
          <RidgeLine data={data} />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default Details;
