// Course Class
class Course {
  constructor (title,instructor,image){
    this.courseId= Math.floor(Math.random()*100000);
    this.title=title;
    this.instructor=instructor;
    this.image=image;
  }

}
// UI Class
class UI {

  // addCourseToList Function
  addCourseToList(course){
    const list = document.getElementById('course-list');
    var html = `
    <tr>
      <td><img src="img/${course.image}"/></td>
      <td>${course.title}</td>
      <td>${course.instructor}</td>
      <td><a href="#" data-id="${course.courseId}" class="btn btn-danger btn-sm delete">Delete</a></td>
    </tr>
    `;

    list.innerHTML+=html;
  }
  // clearControl Function
  clearControls(){
    const title = document.getElementById('title').value="";
    const instructor = document.getElementById('instructor').value="";
    const image = document.getElementById('image').value="";
  }
  // deleteCourse Function
  deleteCourse(element){
    if(element.classList.contains('delete')){
      element.parentElement.parentElement.remove();
    }
  }
  // showAlert Function
  showAlert(message,className){
    var alert = `
              <div class="alert alert-${className}">
                ${message}
              </div>
              `
    var row = document.querySelector('.row');
    // insertAdjacentHTML function parameters = beforeBegin, afterBegin, beforeEnd, afterEnd. wir wollen vor der row element.daher benutzen wir beforeBegin
    row.insertAdjacentHTML('beforeBegin',alert);

    setTimeout(() => {
    document.querySelector('.alert').remove();// das Element, das wir nach 5 Sekunden löschen wollen
    },5000);// 5000 milisecond = 5 second
  }
}
// Storage Class
class Storage {
  static getCourses (){ // Wenn wir Seite öffnen, nehmen wir vom LS die Informationen
    let courses;
    if (localStorage.getItem('courses')===null){
      courses = [];
    }
    else{
      courses =JSON.parse(localStorage.getItem('courses')); // ändern wir das Form vom JSON string to JSON object bei, um vom LS course info zu ziehen
    }
    return courses;
  }
  static displayCourses(){ // und zeigen wir diese Informationen (course informationen) auf der Seite oder Liste
    const courses = Storage.getCourses();
    courses.forEach(course => {
      const ui= new UI ();
      ui.addCourseToList(course);
    });
  }
  static addCourse(course){ // neuen Kurs zu LS hinzufügen
    const courses = Storage.getCourses();
    courses.push(course);
    localStorage.setItem('courses',JSON.stringify(courses));
  }
  static deleteCourse(element){ // einen Kurs vom LS löschen
    if(element.classList.contains('delete')){
      const id=element.getAttribute('data-id');
      const courses = Storage.getCourses();

      courses.forEach((course,index)=>{
        if(course.courseId==id){
          courses.splice(index,1);
        }
        localStorage.setItem('courses',JSON.stringify(courses));
      });
    }
  }
}

// zeigen wir auf der Seite, was wir beim LS haben, sobald die Seite geladen wird. DOMContentLoaded Event
document.addEventListener('DOMContentLoaded',Storage.displayCourses);

// save button submit event
document.getElementById('new-course').addEventListener('submit',function(e){
  const title = document.getElementById('title').value;
  const instructor = document.getElementById('instructor').value;
  const image = document.getElementById('image').value;

  // creating course object
  const course = new Course(title,instructor,image);

  // creating UI
  const ui = new UI();
  if (title==="" || instructor==="" || image===""){
    ui.showAlert('Please complete the form','warning'); // erste teil message, zweite teil alert Art
  }
  else{
    // add course to list
    ui.addCourseToList(course);

    // save to Storage
    Storage.addCourse(course);

    // clear controls
    ui.clearControls();

    ui.showAlert('the course has been added','success');
  }

  e.preventDefault();
});

// delete button click event
document.getElementById('course-list').addEventListener('click',function(e){
  const ui = new UI();

  // delete Course
  ui.deleteCourse(e.target);

  // delete course from LS
  Storage.deleteCourse(e.target);

  // Alert function
  ui.showAlert('the course has been deleted','danger');
});
