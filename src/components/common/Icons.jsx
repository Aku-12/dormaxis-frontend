/**
 * DormAxis Icons
 * Centralized icon exports using react-icons
 * Using consistent sizing and styling across the app
 */

// Heroicons (Hi2) - Main icon set
import {
  HiOutlineHeart,
  HiHeart,
  HiOutlineBell,
  HiOutlineUser,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineMagnifyingGlass,
  HiOutlineXMark,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineCheck,
  HiOutlineExclamationTriangle,
  HiOutlineExclamationCircle,
  HiOutlineInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiOutlineEnvelope,
  HiOutlineLockClosed,
  HiOutlinePhone,
  HiOutlineMapPin,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineStar,
  HiStar,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUsers,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineMinus,
  HiOutlineCamera,
  HiOutlinePhoto,
  HiOutlineClipboardDocument,
  HiOutlineArrowDownTray,
  HiOutlineArrowPath,
  HiOutlineShieldCheck,
  HiOutlineQrCode,
  HiOutlineKey,
  HiOutlineBars3,
  HiOutlineXCircle,
} from 'react-icons/hi2';

// Feather Icons (Fi) - Additional icons
import {
  FiWifi,
  FiMonitor,
  FiCoffee,
  FiDroplet,
  FiSun,
  FiMoon,
  FiThermometer,
  FiTv,
  FiGrid,
  FiList,
  FiFilter,
  FiShare2,
  FiCopy,
  FiExternalLink,
  FiGithub,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
} from 'react-icons/fi';

// Font Awesome (Fa) - Specific icons
import {
  FaCar,
  FaSwimmingPool,
  FaDumbbell,
  FaCouch,
  FaUtensils,
  FaSnowflake,
  FaFire,
  FaWind,
  FaTshirt,
  FaBed,
  FaShower,
  FaParking,
  FaCreditCard,
  FaWallet,
} from 'react-icons/fa';

// Bootstrap Icons (Bs) - Additional
import {
  BsHouseDoor,
  BsBuilding,
  BsStarFill,
  BsStarHalf,
  BsStar,
} from 'react-icons/bs';

// Icon size presets
export const iconSizes = {
  xs: 'w-3 h-3',
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
  '2xl': 'w-10 h-10',
  '3xl': 'w-12 h-12',
};

// Default icon class
const defaultClass = 'w-5 h-5';

// Navigation & UI Icons
export const MenuIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineBars3 className={className} {...props} />
);

export const CloseIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineXMark className={className} {...props} />
);

export const SearchIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineMagnifyingGlass className={className} {...props} />
);

export const ChevronDownIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineChevronDown className={className} {...props} />
);

export const ChevronUpIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineChevronUp className={className} {...props} />
);

export const ChevronLeftIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineChevronLeft className={className} {...props} />
);

export const ChevronRightIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineChevronRight className={className} {...props} />
);

export const FilterIcon = ({ className = defaultClass, ...props }) => (
  <FiFilter className={className} {...props} />
);

export const GridIcon = ({ className = defaultClass, ...props }) => (
  <FiGrid className={className} {...props} />
);

export const ListIcon = ({ className = defaultClass, ...props }) => (
  <FiList className={className} {...props} />
);

// User & Auth Icons
export const UserIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineUser className={className} {...props} />
);

export const LockIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineLockClosed className={className} {...props} />
);

export const KeyIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineKey className={className} {...props} />
);

export const ShieldIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineShieldCheck className={className} {...props} />
);

export const QrCodeIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineQrCode className={className} {...props} />
);

export const EyeIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineEye className={className} {...props} />
);

export const EyeOffIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineEyeSlash className={className} {...props} />
);

export const LogoutIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineArrowRightOnRectangle className={className} {...props} />
);

export const SettingsIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineCog6Tooth className={className} {...props} />
);

// Notification Icons
export const BellIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineBell className={className} {...props} />
);

export const HeartIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineHeart className={className} {...props} />
);

export const HeartFilledIcon = ({ className = defaultClass, ...props }) => (
  <HiHeart className={className} {...props} />
);

// Status & Feedback Icons
export const CheckIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineCheck className={className} {...props} />
);

export const CheckCircleIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineCheckCircle className={className} {...props} />
);

export const ErrorIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineXCircle className={className} {...props} />
);

export const WarningIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineExclamationTriangle className={className} {...props} />
);

export const InfoIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineInformationCircle className={className} {...props} />
);

export const ExclamationIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineExclamationCircle className={className} {...props} />
);

// Contact Icons
export const EmailIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineEnvelope className={className} {...props} />
);

export const PhoneIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlinePhone className={className} {...props} />
);

export const LocationIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineMapPin className={className} {...props} />
);

// Time & Date Icons
export const CalendarIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineCalendar className={className} {...props} />
);

export const ClockIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineClock className={className} {...props} />
);

// Star Rating Icons
export const StarIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineStar className={className} {...props} />
);

export const StarFilledIcon = ({ className = defaultClass, ...props }) => (
  <HiStar className={className} {...props} />
);

export const StarHalfIcon = ({ className = defaultClass, ...props }) => (
  <BsStarHalf className={className} {...props} />
);

// Building & Home Icons
export const HomeIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineHome className={className} {...props} />
);

export const BuildingIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineBuildingOffice2 className={className} {...props} />
);

export const UsersIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineUsers className={className} {...props} />
);

export const BedIcon = ({ className = defaultClass, ...props }) => (
  <FaBed className={className} {...props} />
);

// Action Icons
export const EditIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlinePencil className={className} {...props} />
);

export const DeleteIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineTrash className={className} {...props} />
);

export const PlusIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlinePlus className={className} {...props} />
);

export const MinusIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineMinus className={className} {...props} />
);

export const CameraIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineCamera className={className} {...props} />
);

export const PhotoIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlinePhoto className={className} {...props} />
);

export const CopyIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineClipboardDocument className={className} {...props} />
);

export const DownloadIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineArrowDownTray className={className} {...props} />
);

export const RefreshIcon = ({ className = defaultClass, ...props }) => (
  <HiOutlineArrowPath className={className} {...props} />
);

export const ShareIcon = ({ className = defaultClass, ...props }) => (
  <FiShare2 className={className} {...props} />
);

export const ExternalLinkIcon = ({ className = defaultClass, ...props }) => (
  <FiExternalLink className={className} {...props} />
);

// Amenity Icons
export const WifiIcon = ({ className = defaultClass, ...props }) => (
  <FiWifi className={className} {...props} />
);

export const AcIcon = ({ className = defaultClass, ...props }) => (
  <FaSnowflake className={className} {...props} />
);

export const HeatingIcon = ({ className = defaultClass, ...props }) => (
  <FaFire className={className} {...props} />
);

export const ParkingIcon = ({ className = defaultClass, ...props }) => (
  <FaParking className={className} {...props} />
);

export const LaundryIcon = ({ className = defaultClass, ...props }) => (
  <FaTshirt className={className} {...props} />
);

export const KitchenIcon = ({ className = defaultClass, ...props }) => (
  <FaUtensils className={className} {...props} />
);

export const TvIcon = ({ className = defaultClass, ...props }) => (
  <FiTv className={className} {...props} />
);

export const GymIcon = ({ className = defaultClass, ...props }) => (
  <FaDumbbell className={className} {...props} />
);

export const PoolIcon = ({ className = defaultClass, ...props }) => (
  <FaSwimmingPool className={className} {...props} />
);

export const FurnishedIcon = ({ className = defaultClass, ...props }) => (
  <FaCouch className={className} {...props} />
);

export const ShowerIcon = ({ className = defaultClass, ...props }) => (
  <FaShower className={className} {...props} />
);

// Payment Icons
export const CreditCardIcon = ({ className = defaultClass, ...props }) => (
  <FaCreditCard className={className} {...props} />
);

export const WalletIcon = ({ className = defaultClass, ...props }) => (
  <FaWallet className={className} {...props} />
);

// Social Icons
export const FacebookIcon = ({ className = defaultClass, ...props }) => (
  <FiFacebook className={className} {...props} />
);

export const TwitterIcon = ({ className = defaultClass, ...props }) => (
  <FiTwitter className={className} {...props} />
);

export const InstagramIcon = ({ className = defaultClass, ...props }) => (
  <FiInstagram className={className} {...props} />
);

export const LinkedinIcon = ({ className = defaultClass, ...props }) => (
  <FiLinkedin className={className} {...props} />
);

export const GithubIcon = ({ className = defaultClass, ...props }) => (
  <FiGithub className={className} {...props} />
);

// Theme Icons
export const SunIcon = ({ className = defaultClass, ...props }) => (
  <FiSun className={className} {...props} />
);

export const MoonIcon = ({ className = defaultClass, ...props }) => (
  <FiMoon className={className} {...props} />
);

// Amenity icon mapping for dynamic rendering
export const amenityIcons = {
  wifi: WifiIcon,
  'air conditioning': AcIcon,
  ac: AcIcon,
  parking: ParkingIcon,
  laundry: LaundryIcon,
  furnished: FurnishedIcon,
  kitchen: KitchenIcon,
  tv: TvIcon,
  'smart tv': TvIcon,
  gym: GymIcon,
  pool: PoolIcon,
  heating: HeatingIcon,
  shower: ShowerIcon,
};

// Get amenity icon by name
export const getAmenityIcon = (amenityName) => {
  const normalizedName = amenityName.toLowerCase().trim();
  return amenityIcons[normalizedName] || HomeIcon;
};

// Default export all icons
export default {
  // Navigation
  MenuIcon,
  CloseIcon,
  SearchIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  GridIcon,
  ListIcon,
  // User & Auth
  UserIcon,
  LockIcon,
  KeyIcon,
  ShieldIcon,
  QrCodeIcon,
  EyeIcon,
  EyeOffIcon,
  LogoutIcon,
  SettingsIcon,
  // Notifications
  BellIcon,
  HeartIcon,
  HeartFilledIcon,
  // Status
  CheckIcon,
  CheckCircleIcon,
  ErrorIcon,
  WarningIcon,
  InfoIcon,
  ExclamationIcon,
  // Contact
  EmailIcon,
  PhoneIcon,
  LocationIcon,
  // Time
  CalendarIcon,
  ClockIcon,
  // Rating
  StarIcon,
  StarFilledIcon,
  StarHalfIcon,
  // Building
  HomeIcon,
  BuildingIcon,
  UsersIcon,
  BedIcon,
  // Actions
  EditIcon,
  DeleteIcon,
  PlusIcon,
  MinusIcon,
  CameraIcon,
  PhotoIcon,
  CopyIcon,
  DownloadIcon,
  RefreshIcon,
  ShareIcon,
  ExternalLinkIcon,
  // Amenities
  WifiIcon,
  AcIcon,
  HeatingIcon,
  ParkingIcon,
  LaundryIcon,
  KitchenIcon,
  TvIcon,
  GymIcon,
  PoolIcon,
  FurnishedIcon,
  ShowerIcon,
  // Payment
  CreditCardIcon,
  WalletIcon,
  // Social
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedinIcon,
  GithubIcon,
  // Theme
  SunIcon,
  MoonIcon,
};
