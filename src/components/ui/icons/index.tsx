import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const OutlineIcon = ({ children, className = 'h-5 w-5', ...props }: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
};

const HelpIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.7 2.2c-.7.4-1.2.9-1.2 1.8v.3" />
      <circle cx="12" cy="17" r="0.4" fill="currentColor" stroke="none" />
    </OutlineIcon>
  );
};

const SettingsIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13.5a7.97 7.97 0 0 0 0-3l1.9-1.5-2-3.4-2.2.9a8 8 0 0 0-2.6-1.5L16 2h-4l-.4 2.5a8 8 0 0 0-2.6 1.5l-2.2-.9-2 3.4L6.6 10.5a8 8 0 0 0 0 3L4.7 15l2 3.4 2.2-.9a8 8 0 0 0 2.6 1.5L12 22h4l.4-2.5a8 8 0 0 0 2.6-1.5l2.2.9 2-3.4z" />
    </OutlineIcon>
  );
};

const AlertIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M10.29 3.86 1.82 18a1.5 1.5 0 0 0 1.3 2.25h17.76a1.5 1.5 0 0 0 1.3-2.25L13.71 3.86a1.5 1.5 0 0 0-2.6 0Z" />
      <path d="M12 9v4" />
      <circle cx="12" cy="16.5" r="0.4" fill="currentColor" stroke="none" />
    </OutlineIcon>
  );
};

const UploadIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15" />
    </OutlineIcon>
  );
};

const PlusIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M12 5v14M5 12h14" />
    </OutlineIcon>
  );
};

const DocumentIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M7 3.5h7l4 4v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-16a1 1 0 0 1 1-1Z" />
      <path d="M14 3.5V8h4" />
      <path d="M8.5 12.5h7M8.5 16h4.5" />
    </OutlineIcon>
  );
};

const TrashIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M4 7h16" />
      <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
      <path d="M10 11v6M14 11v6" />
    </OutlineIcon>
  );
};

const SearchIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </OutlineIcon>
  );
};

const ChevronDownIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M6 9l6 6 6-6" />
    </OutlineIcon>
  );
};

const InfoIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5" />
      <circle cx="12" cy="7.5" r="0.4" fill="currentColor" stroke="none" />
    </OutlineIcon>
  );
};

const ReplaceIcon = (props: IconProps) => {
  return (
    <OutlineIcon {...props}>
      <path d="M16 3l4 4-4 4" />
      <path d="M20 7H9a5 5 0 0 0-5 5" />
      <path d="M8 21l-4-4 4-4" />
      <path d="M4 17h11a5 5 0 0 0 5-5" />
    </OutlineIcon>
  );
};

const MoreVerticalIcon = (props: IconProps) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={props.className ?? 'h-5 w-5'}
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="5" r="1.75" />
      <circle cx="12" cy="12" r="1.75" />
      <circle cx="12" cy="19" r="1.75" />
    </svg>
  );
};

export {
  AlertIcon,
  ChevronDownIcon,
  DocumentIcon,
  HelpIcon,
  InfoIcon,
  MoreVerticalIcon,
  PlusIcon,
  ReplaceIcon,
  SearchIcon,
  SettingsIcon,
  TrashIcon,
  UploadIcon,
};
