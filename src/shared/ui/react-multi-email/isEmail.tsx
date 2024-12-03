export interface IFqdnOptions {
  requireTld?: boolean;
  allowUnderscores?: boolean;
  allowTrailingDot?: boolean;
}

export interface IEmailOptions {
  allowDisplayName?: boolean;
  requireDisplayName?: boolean;
  allowUtf8LocalPart?: boolean;
  requireTld?: boolean;
}

const defaultFqdnOptions = {
  requireTld: true,
  allowUnderscores: false,
  allowTrailingDot: false,
};

const defaultEmailOptions = {
  allowDisplayName: false,
  requireDisplayName: false,
  allowUtf8LocalPart: true,
  requireTld: true,
};

const displayName =
  // eslint-disable-next-line no-useless-escape
  /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\,\.\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF\s]*<(.+)>$/i;
// eslint-disable-next-line no-useless-escape
const emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
const quotedEmailUser =
  // eslint-disable-next-line no-control-regex
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
const emailUserUtf8Part =
  // eslint-disable-next-line no-useless-escape
  /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
const quotedEmailUserUtf8 =
  // eslint-disable-next-line no-control-regex
  /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;

/* eslint-disable prefer-rest-params */
function isByteLength(str: string, options: { min?: number; max?: number }) {
  let min: number = 0;
  let max: number | undefined;
  const len = encodeURI(str).split(/%..|./).length - 1;

  if (options) {
    min = Number(options.min) || 0;
    max = Number(options.max);
  }

  return len >= min && (typeof max === 'undefined' || len <= max);
}

function isFQDN(str: string, options?: IFqdnOptions) {
  const mergeOption = { ...defaultFqdnOptions, ...options };
  let textStr: string = str;
  /* Remove the optional trailing dot before checking validity */
  if (mergeOption.allowTrailingDot && str[str.length - 1] === '.') {
    textStr = str.substring(0, str.length - 1);
  }
  const parts = textStr.split('.');

  if (mergeOption.requireTld) {
    const tld: string = `${parts.pop()}`;
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
    // disallow spaces
    // eslint-disable-next-line no-misleading-character-class
    if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20]/.test(tld)) {
      return false;
    }
  }

  for (let part, i = 0; i < parts.length; i += 1) {
    part = parts[i];
    if (mergeOption.allowUnderscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    // disallow full-width chars
    if (/[\uff01-\uff5e]/.test(part)) {
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}

export function isEmail(str: string, options?: IEmailOptions) {
  const mergeOption = { ...defaultEmailOptions, ...options };
  let textStr: string = str;

  if (mergeOption.requireDisplayName || mergeOption.allowDisplayName) {
    const displayEmail = textStr.match(displayName);
    if (displayEmail) {
      textStr = displayEmail[1] as any;
    } else if (mergeOption.requireDisplayName) {
      return false;
    }
  }

  const parts: string[] = str.split('@');
  const domain: string = `${parts.pop()}`;
  const lowerDomain = domain.toLowerCase();
  let user: string = parts.join('@');

  if (lowerDomain === 'gmail.com' || lowerDomain === 'googlemail.com') {
    user = user.replace(/\./g, '').toLowerCase();
  }

  if (!isByteLength(user, { max: 64 }) || !isByteLength(domain, { max: 254 })) {
    return false;
  }

  if (!isFQDN(domain, { requireTld: mergeOption.requireTld })) {
    return false;
  }

  if (user[0] === '"') {
    user = user.slice(1, user.length - 1);
    return mergeOption.allowUtf8LocalPart ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
  }

  const pattern = mergeOption.allowUtf8LocalPart ? emailUserUtf8Part : emailUserPart;
  const userParts = user.split('.');

  for (let i = 0; i < userParts.length; i += 1) {
    if (!pattern.test(userParts[i] as string)) {
      return false;
    }
  }

  return true;
}
