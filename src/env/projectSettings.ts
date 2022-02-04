import { EnvNetwork } from './types';

export const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
export const NETWORK: EnvNetwork = process.env.NETWORK || 'testnet';
