const XLSX = require('xlsx');

// Function to convert decimal time to datetime
function convertDecimalToDatetime(decimalTime) {
    const baseDate = new Date('1899-12-30');
    const millisecondsInADay = 24 * 60 * 60 * 1000;
    const convertedDate = new Date(baseDate.getTime() + decimalTime * millisecondsInADay);
    return convertedDate;
}

const workbook = XLSX.readFile('Assignment_Timecard.xlsx');
const worksheet = workbook.Sheets.Sheet1;
const employees = XLSX.utils.sheet_to_json(worksheet);

class EmployeeAnalyzer {
    constructor(employeeData) {
        this.employeeData = employeeData;
    }

    // Function to calculate total time spent per day for each position ID
    calculateTotalTimePerDayByPositionID() {
        const totalTimePerDayByPositionID = {};

        this.employeeData.forEach(employee => {
            const positionID = employee['Position ID'];
            const timeOut = convertDecimalToDatetime(employee['Time Out']);
            const dateKey = timeOut.toISOString().split('T')[0];

            if (!totalTimePerDayByPositionID[positionID]) {
                totalTimePerDayByPositionID[positionID] = {};
            }

            if (!totalTimePerDayByPositionID[positionID][dateKey]) {
                totalTimePerDayByPositionID[positionID][dateKey] = 0;
            }

            const [hours, minutes] = employee['Timecard Hours (as Time)'].split(':').map(Number);
            const totalTimeInMinutes = hours * 60 + minutes;

            totalTimePerDayByPositionID[positionID][dateKey] += totalTimeInMinutes;
        });

        return totalTimePerDayByPositionID;
    }

    // Function to get a list of employees and position IDs who spend between 1 to 10 hours in a day
    listEmployees1to10HoursPerDay() {
        const selectedEmployees = this.employeeData.filter(employee => {
            const [hours, minutes] = employee['Timecard Hours (as Time)'].split(':').map(Number);
            const totalTimeInMinutes = hours * 60 + minutes;

            return totalTimeInMinutes >= 60 && totalTimeInMinutes <= 10 * 60;
        });

        const result = selectedEmployees.map(employee => ({
            'Employee Name': employee['Employee Name'],
            'Position ID': employee['Position ID'],
        }));

        this.printResult("Employees who spend 1 to 10 hours in a day:", result);
    }

    // Function to get a list of employees with days in sequential order
    listEmployeesInSequenceOrder() {
        // Assuming the data is already sorted by date for sequential order
        const result = this.employeeData.map(employee => ({
            'Employee Name': employee['Employee Name'],
            'Position ID': employee['Position ID'],
            'Time Out': convertDecimalToDatetime(employee['Time Out']).toLocaleString(),
        }));

        this.printResult("Employees with days in sequential order:", result);
    }

    // Function to count the number of employees who spend more than 14 hours in a day
    countEmployeesMoreThan14HoursPerDay() {
        const result = this.employeeData.filter(employee => {
            const [hours, minutes] = employee['Timecard Hours (as Time)'].split(':').map(Number);
            const totalTimeInMinutes = hours * 60 + minutes;

            return totalTimeInMinutes > 14 * 60;
        });

        this.printResult("Number of employees spending more than 14 hours in a day:", result.length);
    }

    printResult(message, result) {
        console.log(message);
        console.log(JSON.stringify(result, null, 2)); // Pretty-print JSON
        console.log("---------");
    }
}

// Create an instance of the EmployeeAnalyzer class
const analyzer = new EmployeeAnalyzer(employees);
analyzer.listEmployees1to10HoursPerDay();
analyzer.listEmployeesInSequenceOrder();
analyzer.countEmployeesMoreThan14HoursPerDay();
