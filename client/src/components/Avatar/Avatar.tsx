interface IAvatar {
  status?: string;
  src: string;
  width?: string;
  height?: string;
}
const Avatar = ({ status, src, width, height }: IAvatar) => {
  const userStatus: any = {
    online: 'bg-[#43A047]',
    offline: 'bg-[#808080]',
    away: 'bg-[#ffbf00]'
  };
  return (
    <div className="relative inline-block">
      <img
        className={`inline-block ${height} ${width} rounded-full object-cover`}
        src={src}
        alt="Group chat image"
      />
      {status && (
        <span
          className={`absolute bottom-0 right-0 inline-block h-3 w-3 rounded-full border-2 border-white ${userStatus[status]}`}
        ></span>
      )}
    </div>
  );
};
export default Avatar;
