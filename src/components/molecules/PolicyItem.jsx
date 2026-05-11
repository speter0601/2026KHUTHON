import Badge from '../atoms/Badge';
import Subtitle from '../atoms/Subtitle';

/**
 * PolicyItem molecule for list displays.
 * Features a clean layout with status badges.
 */
const PolicyItem = ({ name, status, date, className = "" }) => {
  const statusVariant =
    status === 'Active' ? 'success' :
      status === 'Pending' ? 'warning' :
        status === 'Archived' ? 'neutral' : 'neutral';

  return (
    <div className={`
      flex items-center justify-between py-3.5 group
      ${className}
    `}>
      <div className="flex flex-col gap-0.5">
        <span className="text-[14px] font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
          {name}
        </span>
        <Subtitle className="text-[12px]">{date}</Subtitle>
      </div>
      <Badge variant={statusVariant}>
        {status}
      </Badge>
    </div>
  );
};

export default PolicyItem;
