const GITHUB_USERNAME = "inzz3";
const REPO_NAME = "website";
const FILE_PATH = "students.json"; // File where data will be saved
const BRANCH = "main";
const GITHUB_TOKEN = "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"; // Your GitHub token

document.addEventListener("DOMContentLoaded", function () {
    const gradeForm = document.getElementById("gradeForm");
    const gradeList = document.getElementById("gradeList");
    const summary = document.getElementById("summary");
    const saveButton = document.getElementById("saveData");

    let students = [];

    // Fetch student data from GitHub
    async function loadStudents() {
        try {
            const response = await fetch(`https://raw.githubusercontent.com/${GITHUB_USERNAME}/${REPO_NAME}/${BRANCH}/${FILE_PATH}`);
            if (response.ok) {
                students = await response.json();
                updateGradeList();
            }
        } catch (error) {
            console.error("Error fetching student data:", error);
        }
    }

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
            li.textContent = `${student.name} - ${student.mark} - ${student.grade}`;
            gradeList.appendChild(li);
        });
        updateSummary();
    }

    function updateSummary() {
        const gradeCount = { A: 0, B: 0, C: 0, D: 0, E: 0, U: 0 };
        let totalMarks = 0;

        students.forEach(student => {
            gradeCount[student.grade]++;
            totalMarks += student.mark;
        });

        const averageMark = students.length ? (totalMarks / students.length).toFixed(2) : 0;
        const highestMark = students.length ? Math.max(...students.map(s => s.mark)) : "N/A";
        const lowestMark = students.length ? Math.min(...students.map(s => s.mark)) : "N/A";

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

    // Save student data to GitHub
    async function saveStudentsToGitHub() {
        const fileContent = JSON.stringify(students, null, 2);
        const encodedContent = btoa(unescape(encodeURIComponent(fileContent))); // Convert to Base64

        try {
            // Fetch the current file SHA (GitHub requires it for updates)
            let sha = "";
            const fileResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`);
            if (fileResponse.ok) {
                const fileData = await fileResponse.json();
                sha = fileData.sha;
            }

            // Send the update request to GitHub
            const response = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/${FILE_PATH}`, {
                method: "PUT",
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Accept": "application/vnd.github.v3+json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: "Updated student data",
                    content: encodedContent,
                    branch: BRANCH,
                    sha: sha || undefined
                })
            });

            if (response.ok) {
                alert("Student data saved to GitHub!");
            } else {
                console.error("GitHub API error:", await response.json());
                alert("Error saving to GitHub.");
            }
        } catch (error) {
            console.error("Error saving students:", error);
            alert("Error saving to GitHub.");
        }
    }

    saveButton.addEventListener("click", saveStudentsToGitHub);

    loadStudents(); // Load saved data on page load
});
