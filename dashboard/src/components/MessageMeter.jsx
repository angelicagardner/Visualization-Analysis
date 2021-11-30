function MessageMeter({ data }) {
  return (
    <div className="messageMeter">
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
