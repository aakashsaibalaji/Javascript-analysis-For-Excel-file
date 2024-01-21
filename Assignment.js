class EmployeeSorting{
  constructor(employeeData){
    this.employeeData = employeeData;
  }
  employeesWorking1to8hours() {
    const result = this.employeeData
      .filter(employee => employee.timecard >= 1 && employee.timecard <= 8)
      .map(employee => {
        return {
          positionId: employee['Position Id'],
          name: employee['Name'],
          hours: employee['timecard']
        };
      });

    return result;
  }
  highestworkinghour(){
    const list = this.employeeData.filter(employee => employee.timecard >6).map(
      employee=>{
        return {
          positionId :employee['Position Id'],
          name :employee['Name']
        }
      }
    )
    return list;
  }
}
//timecard represent the no of hours break has be taken between the shifts.
let Details = [{
  'Position Id':"0001",
  "Name":"John Doe",
  "timecard":4,
},{
  'Position Id':"0002",
  "Name":"Jane Smith",
  "timecard":9
},{
  'Position Id':"0003",
  "Name":"Tom Brown",
  "timecard":5
},{
  'Position Id':"0004",
  "Name":"Tom curise",
  "timecard":0.50
}]

const main = new EmployeeSorting(Details);

console.log(main.employeesWorking1to8hours());
console.log(main.highestworkinghour());
