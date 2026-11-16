const student=[
    {id:1,name:'cherry',age:20},{id:2,name:'suni',age:19},{id:3,name:'trisha',age:18}
];
const newstudent={id:4,name:'nandhini',age:20};
student.push(newstudent);
console.log('All student: ',student);
const studentidtoupdate=2;
const studenttoread=student.find(student=>student.id===studentidtoupdate);
console.log('Student with ID ${studentidtoupdate}: ',studenttoread);
const studenttoupdate=3;
const updatestudent=student.find(student=>student.id===studenttoupdate);
const studentindextoupdate=student.findIndex(student=>student.id===studenttoupdate);
if(studentindextoupdate!==-1){
    student[studentindextoupdate]={...updatestudent,name:'sam',age:25};
    console.log('updated student with ID ${studenttoupdate}: ',student[studentindextoupdate]);
}else{
    console.log('student with id ${studenttoupadate} not found.');
}
const studenttodelete=1;
const studentindextodelete=student.findIndex(student=>student.id===studenttodelete);
if(studentindextodelete!==-1){
    const deletestudent=student.splice(studentindextodelete,1)[0];
    console.log('Delete student with id ${studenttodelete}:',deletestudent);
}else{
    console.log('student with id ${studenttodelete} not found.');
}



console.log('All student records after CRUD operations:',student);