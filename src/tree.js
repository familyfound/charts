
import data from './data.js';

const peopleList = data.persons.map(person => person.display);

const people = {}
peopleList.forEach(person => people[person.ascendancyNumber] = person);
// peopleList.forEach(person => {
//   if (person.ascendancyNumber === '1-S' || person.ascendancyNumber === '1') {
//     return
//   }
//   const num = +person.ascendancyNumber;
//   if (isNaN(num)) {
//     return console.error(person)
//   }
//   const child = Math.floor(num / 2)
//   const rel = num % 2 == 1 ? 'mother' : 'father';
// })

export const father = num => num * 2;
export const mother = num => num * 2 + 1;
export {people, peopleList};