import * as migration_20260322_212609 from './20260322_212609';
import * as migration_20260322_212751 from './20260322_212751';

export const migrations = [
  {
    up: migration_20260322_212609.up,
    down: migration_20260322_212609.down,
    name: '20260322_212609',
  },
  {
    up: migration_20260322_212751.up,
    down: migration_20260322_212751.down,
    name: '20260322_212751'
  },
];
