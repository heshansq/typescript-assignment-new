// Extend this type to make it support the usage below.
// path should be recieved in dot notation and should give suggestions on keys.
// correct return type should be calculated depending on the given path.

/**
 * ValueTypeInPath: type which will use to calculate the return type of get method
 */
type ValueTypeInPath<T, P extends string> = P extends keyof T
  ? T[P]
  : P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? ValueTypeInPath<T[Key], Rest>
    : never
  : never;

/**
 * NestedKeys: type which use to get nested keys and provide suggetion on path
 */
type NestedKeys<T> = {
  [Key in keyof T & (string | number)]: T[Key] extends any[]
    ? `${Key}`
    : T[Key] extends object
    ? `${Key}` | `${Key}.${NestedKeys<T[Key]>}`
    : `${Key}`;
}[keyof T & (string | number)];

/**
 * getKeyValue: a recursive function outside of main get function to get value of the given path
 */
function getKeyValue<T, P>(currentObject: T, currentKey: P): T {
  return (
    currentObject !== undefined && currentObject?.[currentKey as keyof T]
      ? currentObject?.[currentKey as keyof T]
      : undefined
  ) as T;
}

//declare function get<T, P extends NestedKeys<T> & string>(obj: {}, path: string): ValueTypeInPath<T, P>;

/**
 * get: get method with generic types
 */
function get<T, P extends NestedKeys<T> & string>(
  obj: T,
  path: P
): ValueTypeInPath<T, P> {
  return path.split('.')?.reduce(getKeyValue, obj) as ValueTypeInPath<T, P>;
}

const object = {
  user: {
    fullName: 'Janis Pagac',
    age: 30,
    address: {
      street: '83727 Beatty Garden',
      city: 'Hamilton',
    },
    friends: {
      '0': {
        fullName: 'Franklin Kuhn',
        age: 20,
      },
      '1': {
        fullName: 'Hubert Sawayn',
      },
    },
  },
};

const fullName = get(object, 'user.fullName');
const age = get(object, 'user.age');
const street = get(object, 'user.address.street');
const fullNameOfFriend = get(object, 'user.friends.0.fullName');
const ageOfFriend = get(object, 'user.friends.0.age');

console.log({ fullName });
console.log({ age });
console.log({ street });
console.log({ fullNameOfFriend });
console.log({ ageOfFriend });

let information = `
    <p>fullName: ${fullName}</p>
    <p>age: ${age}</p>
    <p>street: ${street}</p>
    <p>Full Name of Friend: ${fullNameOfFriend}</p>
    <p>Age of Friend: ${ageOfFriend}</p>
  `;

const appDiv: HTMLElement = document.getElementById('app');
appDiv.innerHTML = information;
