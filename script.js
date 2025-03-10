document.addEventListener("DOMContentLoaded", function () {
    const gradeForm = document.getElementById("gradeForm");
    const gradeList = document.getElementById("gradeList");
    const summary = document.getElementById("summary");

    let students = [];

    gradeForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("studentName").value.trim();
        const mark = parseInt(document.getElementById("studentMark").value);

        if (name === "" || isNaN(mark) || mark < 0 || mark > 100) {
            alert("Please enter a valid name and mark (0-100).");
            return;
        }

        const grade = calculateGrade(mark);
        students.push({ name, mark, grade });

        updateGradeList();
        updateSummary();

        gradeForm.reset();
    });

    function calculateGrade(mark) {
        if (mark >= 90) return "A";
        if (mark >= 80) return "B";
        if (mark >= 70) return "C";
        if (mark >= 60) return "D";
        if (mark >= 50) return "E";
        return "U";
    }

    function updateGradeList() {
        gradeList.innerHTML = "";
        students.forEach(student => {
            const li = document.createElement("li");
            li.textContent = `${student.name} - ${student.grade}`;
            gradeList.appendChild(li);
        });
    }

    function updateSummary() {
        const gradeCount = { A: 0, B: 0, C: 0, D: 0, E: 0, U: 0 };
        let totalMarks = 0;

        students.forEach(student => {
            gradeCount[student.grade]++;
            totalMarks += student.mark;
        });

        const averageMark = (students.length > 0) ? (totalMarks / students.length).toFixed(2) : 0;
        const highestMark = students.length > 0 ? Math.max(...students.map(s => s.mark)) : "N/A";
        const lowestMark = students.length > 0 ? Math.min(...students.map(s => s.mark)) : "N/A";

        summary.innerHTML = `
            <strong>A:</strong> ${gradeCount.A} | 
            <strong>B:</strong> ${gradeCount.B} | 
            <strong>C:</strong> ${gradeCount.C} | 
            <strong>D:</strong> ${gradeCount.D} | 
            <strong>E:</strong> ${gradeCount.E} | 
            <strong>U:</strong> ${gradeCount.U} <br>
            <strong>Class Average:</strong> ${averageMark} <br>
            <strong>Highest Mark:</strong> ${highestMark} <br>
            <strong>Lowest Mark:</strong> ${lowestMark}
        `;
    }
});
