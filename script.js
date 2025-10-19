// compiled JS (from the provided TypeScript)
var STORAGE_KEY = 'students_attendance_db_v1';
var ADMIN_CODE = '6457';
function loadStudents() {
    var raw = localStorage.getItem(STORAGE_KEY);
    if (!raw)
        return [];
    try {
        return JSON.parse(raw);
    }
    catch (_a) {
        return [];
    }
}
function saveStudents(students) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}
function calcGrade(marks, total) {
    if (total <= 0)
        return 'N/A';
    var pct = (marks / total) * 100;
    if (pct >= 90)
        return 'A+';
    if (pct >= 80)
        return 'A';
    if (pct >= 70)
        return 'B';
    if (pct >= 60)
        return 'C';
    if (pct >= 50)
        return 'D';
    return 'F';
}
/* --- Result Page Logic --- */
function setupResultPage() {
    var btn = document.getElementById('checkResultBtn');
    var input = document.getElementById('resultRoll');
    var box = document.getElementById('resultBox');
    if (!btn || !input || !box)
        return;
    btn.addEventListener('click', function () {
        var roll = input.value.trim();
        var students = loadStudents();
        var s = students.find(function (st) { return st.roll === roll; });
        box.classList.remove('hidden');
        if (!s) {
            box.innerHTML = "<div class=\"text-red-600\">No student found with roll <strong>" + escapeHtml(roll) + "</strong></div>";
            return;
        }
        box.innerHTML = "\n      <div class=\"space-y-1\">\n        <div><strong>Name:</strong> " + escapeHtml(s.name) + "</div>\n        <div><strong>Roll No:</strong> " + escapeHtml(s.roll) + "</div>\n        <div><strong>Marks:</strong> " + escapeHtml(String(s.marks)) + " / " + escapeHtml(String(s.total)) + "</div>\n        <div><strong>Grade:</strong> " + escapeHtml(s.grade) + "</div>\n        <div><strong>Attendance:</strong> " + escapeHtml(String(s.attendance)) + "%</div>\n      </div>\n    ";
    });
}
/* --- Attendance Page Logic --- */
function setupAttendancePage() {
    var btn = document.getElementById('checkAttBtn');
    var input = document.getElementById('attRoll');
    var box = document.getElementById('attBox');
    if (!btn || !input || !box)
        return;
    btn.addEventListener('click', function () {
        var roll = input.value.trim();
        var students = loadStudents();
        var s = students.find(function (st) { return st.roll === roll; });
        box.classList.remove('hidden');
        if (!s) {
            box.innerHTML = "<div class=\"text-red-600\">No student found with roll <strong>" + escapeHtml(roll) + "</strong></div>";
            return;
        }
        box.innerHTML = "\n      <div>\n        <div><strong>Name:</strong> " + escapeHtml(s.name) + "</div>\n        <div><strong>Roll:</strong> " + escapeHtml(s.roll) + "</div>\n        <div><strong>Attendance:</strong> " + escapeHtml(String(s.attendance)) + "%</div>\n      </div>\n    ";
    });
}
/* --- Admin Page Logic --- */
function setupAdminPage() {
    var loginPanel = document.getElementById('loginPanel');
    var dashboard = document.getElementById('dashboard');
    var loginBtn = document.getElementById('adminLoginBtn');
    var codeInput = document.getElementById('adminCode');
    var loginMsg = document.getElementById('loginMsg');
    var logoutBtn = document.getElementById('logoutBtn');
    var addBtn = document.getElementById('addStudentBtn');
    var sName = document.getElementById('sName');
    var sRoll = document.getElementById('sRoll');
    var sMarks = document.getElementById('sMarks');
    var sTotal = document.getElementById('sTotal');
    var sAttendance = document.getElementById('sAttendance');
    var studentsList = document.getElementById('studentsList');
    var formMsg = document.getElementById('formMsg');
    if (!loginBtn || !codeInput || !loginMsg || !loginPanel || !dashboard)
        return;
    function showDashboard() {
        loginPanel.style.display = 'none';
        dashboard.style.display = 'block';
        renderStudents();
    }
    function hideDashboard() {
        loginPanel.style.display = '';
        dashboard.style.display = 'none';
    }
    loginBtn.addEventListener('click', function () {
        var code = codeInput.value.trim();
        if (code === ADMIN_CODE) {
            showDashboard();
            loginMsg.innerHTML = "<span class=\"text-green-600\">Login successful</span>";
        }
        else {
            loginMsg.innerHTML = "<span class=\"text-red-600\">Wrong code</span>";
        }
    });
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
            hideDashboard();
            if (codeInput)
                codeInput.value = '';
            if (loginMsg)
                loginMsg.innerHTML = '';
        });
    }
    function renderStudents() {
        if (!studentsList)
            return;
        var students = loadStudents();
        if (students.length === 0) {
            studentsList.innerHTML = "<div class=\"text-gray-600\">No students added yet.</div>";
            return;
        }
        studentsList.innerHTML = '';
        students.forEach(function (s, idx) {
            var row = document.createElement('div');
            row.className = 'p-3 border rounded flex items-center justify-between';
            row.innerHTML = "\n        <div>\n          <div class=\"font-medium\">" + escapeHtml(s.name) + "</div>\n          <div class=\"text-sm text-gray-600\">Roll: " + escapeHtml(s.roll) + " \u2022 Marks: " + escapeHtml(String(s.marks)) + "/" + escapeHtml(String(s.total)) + " \u2022 " + escapeHtml(s.grade) + " \u2022 Attendance: " + escapeHtml(String(s.attendance)) + "%</div>\n        </div>\n        <div class=\"flex gap-2\">\n          <button data-action=\"edit\" data-roll=\"" + escapeHtml(s.roll) + "\" class=\"px-2 py-1 bg-yellow-400 rounded\">Edit</button>\n          <button data-action=\"delete\" data-roll=\"" + escapeHtml(s.roll) + "\" class=\"px-2 py-1 bg-red-500 text-white rounded\">Delete</button>\n        </div>\n      ";
            studentsList.appendChild(row);
        });
        studentsList.querySelectorAll('button').forEach(function (b) {
            b.addEventListener('click', function (ev) {
                var target = ev.currentTarget;
                var action = target.getAttribute('data-action');
                var roll = target.getAttribute('data-roll') || '';
                if (action === 'delete') {
                    var arr = loadStudents();
                    arr = arr.filter(function (x) { return x.roll !== roll; });
                    saveStudents(arr);
                    renderStudents();
                    if (formMsg)
                        formMsg.innerHTML = "<span class=\"text-green-600\">Deleted " + roll + "</span>";
                }
                else if (action === 'edit') {
                    var arr = loadStudents();
                    var s = arr.find(function (x) { return x.roll === roll; });
                    if (!s)
                        return;
                    if (sName)
                        sName.value = s.name;
                    if (sRoll)
                        sRoll.value = s.roll;
                    if (sMarks)
                        sMarks.value = String(s.marks);
                    if (sTotal)
                        sTotal.value = String(s.total);
                    if (sAttendance)
                        sAttendance.value = String(s.attendance);
                    if (formMsg)
                        formMsg.innerHTML = "<span class=\"text-blue-600\">Editing " + escapeHtml(roll) + "</span>";
                }
            });
        });
    }
    if (addBtn) {
        addBtn.addEventListener('click', function () {
            var name = (sName === null || sName === void 0 ? void 0 : sName.value.trim()) || '';
            var roll = (sRoll === null || sRoll === void 0 ? void 0 : sRoll.value.trim()) || '';
            var marks = Number((sMarks === null || sMarks === void 0 ? void 0 : sMarks.value) || 0);
            var total = Number((sTotal === null || sTotal === void 0 ? void 0 : sTotal.value) || 0) || 100;
            var attendance = Number((sAttendance === null || sAttendance === void 0 ? void 0 : sAttendance.value) || 0);
            if (!name || !roll) {
                if (formMsg)
                    formMsg.innerHTML = "<span class=\"text-red-600\">Name and Roll are required</span>";
                return;
            }
            var grade = calcGrade(marks, total);
            var arr = loadStudents();
            var idx = arr.findIndex(function (x) { return x.roll === roll; });
            var student = { name: name, roll: roll, marks: marks, total: total, grade: grade, attendance: Math.max(0, Math.min(100, attendance)) };
            if (idx >= 0) {
                arr[idx] = student;
                formMsg.innerHTML = "<span class=\"text-green-600\">Updated " + escapeHtml(roll) + "</span>";
            }
            else {
                arr.push(student);
                formMsg.innerHTML = "<span class=\"text-green-600\">Added " + escapeHtml(roll) + "</span>";
            }
            saveStudents(arr);
            renderStudents();
            if (sName)
                sName.value = '';
            if (sRoll)
                sRoll.value = '';
            if (sMarks)
                sMarks.value = '';
            if (sTotal)
                sTotal.value = '';
            if (sAttendance)
                sAttendance.value = '';
        });
    }
    hideDashboard();
}
/* Utility */
function escapeHtml(s) {
    return (s + '').replace(/[&<>"']/g, function (m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m;
    });
}
/* Initialize based on page */
function init() {
    var page = window.appPage || '';
    if (page === 'result') {
        setupResultPage();
    }
    else if (page === 'attendance') {
        setupAttendancePage();
    }
    else if (page === 'admin') {
        setupAdminPage();
    }
}
document.addEventListener('DOMContentLoaded', init);
