import { AVATAR_COLORS } from '../constants/avatarColors';

const getAvatarColor = (idx: number) => {
    return AVATAR_COLORS[idx % AVATAR_COLORS.length];
};

export default getAvatarColor;
