function MessageMeter({ data, opacity = 1 }) {
  return (
    <div
      className="messageMeter"
      style={{ opacity, transition: '0.25s ease-out' }}
    >
      <div className={`meter ${data.colorClass}`}>
        <progress max="100" value={data.percent * 100}></progress>
        <span>
          {data.messages < 1000 ? data.messages : `${data.messages / 1000} K`}
        </span>
      </div>
      <span className="tips">{data.tip}</span>
    </div>
  );
}

export default MessageMeter;
