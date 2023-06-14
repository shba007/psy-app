import { JWTToken } from './models';

function trimObject<T>(obj: T): T {
  let key: keyof typeof obj;

  for (key in obj) {
    if (obj[key] === undefined) delete obj[key];
  }

  return obj;
}

function parseJWT(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );
  const parsedToken = JSON.parse(jsonPayload) as JWTToken;

  if (parsedToken.exp * 1000 < new Date().getTime())
    throw Error('JWT Expired')

  return parsedToken;
}

function isExpired(dateTime: string | Date) {
  if (typeof dateTime === 'string')
    dateTime = new Date(dateTime)

  return new Date().getTime() > dateTime.getTime()
}

function capitalize(str: string) {
  let result = '';

  for (const word of str.split(' ')) {
    result += ' ' + word.charAt(0).toUpperCase() + word.slice(1);
  }

  return result.slice(1);
}

function range(size: number, startAt: number = 0): ReadonlyArray<number> {
  return [...Array(size).keys()].map((i) => i + startAt);
}

export {
  trimObject, parseJWT, isExpired, capitalize, range,
};
