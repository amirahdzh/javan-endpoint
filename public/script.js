document.addEventListener("DOMContentLoaded", () => {
  // chooser-related elements were removed from the DOM; guard access
  const simpleView = document.getElementById("simpleView");
  const realmBox = document.getElementById("viewBox");
  const realmHeader = document.getElementById("viewHeader");
  const lessPanel = document.getElementById("lessSimplePanel");
  const backBtn = document.getElementById("back");
  const viewToggle = document.getElementById("viewToggle");
  const toSimple = document.getElementById("toSimple");
  const toLess = document.getElementById("toLess");

  // Simple view logic
  const listOut = document.getElementById("listOut");
  const createOut = document.getElementById("createOut");
  const getOut = document.getElementById("getOut");

  async function refresh() {
    try {
      const res = await fetch("/users");
      const data = await res.json();
      listOut.textContent = JSON.stringify(data, null, 2);
    } catch (err) {
      listOut.textContent = "Error: " + err.message;
    }
  }

  // helper to show simple/less panels
  function showSimple() {
    if (simpleView) simpleView.classList.remove("hidden");
    if (lessPanel) lessPanel.classList.add("hidden");
    if (viewToggle) viewToggle.checked = false;
  }
  function showLess() {
    if (lessPanel) lessPanel.classList.remove("hidden");
    if (simpleView) simpleView.classList.add("hidden");
    if (viewToggle) viewToggle.checked = true;
  }

  // wire the toggle input if present
  if (viewToggle) {
    viewToggle.addEventListener("change", (e) => {
      if (e.target.checked) showLess();
      else showSimple();
    });
  }

  // wire hidden buttons (keeps previous hooks working)
  if (toSimple) toSimple.addEventListener("click", showSimple);
  if (toLess) toLess.addEventListener("click", showLess);

  document.addEventListener("click", async (e) => {
    if (!e.target) return;
    if (e.target.id === "refresh") {
      await refresh();
    }
    if (e.target.id === "create") {
      createOut.textContent = "";
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim() || null;
      const ageRaw = document.getElementById("age").value;
      const age = ageRaw === "" ? null : Number(ageRaw);
      if (!name) {
        createOut.textContent = "Name is required";
        return;
      }
      try {
        const res = await fetch("/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, age }),
        });
        const data = await res.json();
        createOut.textContent = JSON.stringify(data, null, 2);
        await refresh();
      } catch (err) {
        createOut.textContent = "Error: " + err.message;
      }
    }
    if (e.target.id === "getBtn") {
      getOut.textContent = "";
      const idRaw = document.getElementById("getId").value.trim();
      if (!idRaw) {
        getOut.textContent = "Enter id";
        return;
      }
      try {
        const res = await fetch("/users/" + encodeURIComponent(idRaw));
        if (res.status === 404) {
          getOut.textContent = "Not found";
          return;
        }
        const data = await res.json();
        getOut.textContent = JSON.stringify(data, null, 2);
      } catch (err) {
        getOut.textContent = "Error: " + err.message;
      }
    }
  });
  // Auto-refresh on load so the list is visible immediately
  refresh();

  // --- Less-Simple CRUD logic ---
  const lsTable = document.getElementById("ls-table");
  const lsTbody = lsTable ? lsTable.querySelector("tbody") : null;
  const lsRefresh = document.getElementById("ls-refresh");
  const lsNew = document.getElementById("ls-new");
  const lsForm = document.getElementById("ls-form");
  const lsId = document.getElementById("ls-id");
  const lsName = document.getElementById("ls-name");
  const lsEmail = document.getElementById("ls-email");
  const lsAge = document.getElementById("ls-age");
  const lsSave = document.getElementById("ls-save");
  const lsCancel = document.getElementById("ls-cancel");
  const lsOut = document.getElementById("ls-out");

  async function lsLoadTable() {
    if (!lsTbody) return;
    try {
      const res = await fetch("/users");
      const data = await res.json();
      lsTbody.innerHTML = "";
      data.forEach((u) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${u.id}</td>
          <td>${escapeHtml(u.name)}</td>
          <td>${u.email ? escapeHtml(u.email) : ""}</td>
          <td>${u.age ?? ""}</td>
          <td>${u.createdAt ?? ""}</td>
          <td>
            <button data-action="edit" data-id="${u.id}">Edit</button>
            <button data-action="delete" data-id="${u.id}">Delete</button>
          </td>
        `;
        lsTbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
    }
  }

  function escapeHtml(s) {
    if (!s) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function lsOpenForm(user) {
    if (!lsForm) return;
    lsForm.classList.remove("hidden");
    if (user) {
      lsId.value = user.id;
      lsName.value = user.name || "";
      lsEmail.value = user.email || "";
      lsAge.value = user.age ?? "";
      document.getElementById("ls-form-title").textContent =
        "Edit user " + user.id;
    } else {
      lsId.value = "";
      lsName.value = "";
      lsEmail.value = "";
      lsAge.value = "";
      document.getElementById("ls-form-title").textContent = "New user";
    }
  }

  function lsCloseForm() {
    if (!lsForm) return;
    lsForm.classList.add("hidden");
    lsOut.textContent = "";
  }

  // handle table actions (edit/delete)
  if (lsTbody) {
    lsTbody.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const action = btn.getAttribute("data-action");
      const id = btn.getAttribute("data-id");
      if (action === "edit") {
        try {
          const res = await fetch("/users/" + encodeURIComponent(id));
          if (res.status === 404) {
            alert("Not found");
            return;
          }
          const user = await res.json();
          lsOpenForm(user);
        } catch (err) {
          console.error(err);
        }
      }
      if (action === "delete") {
        if (!confirm("Delete user " + id + "?")) return;
        try {
          const res = await fetch("/users/" + encodeURIComponent(id), {
            method: "DELETE",
          });
          if (res.ok) {
            await lsLoadTable();
          }
        } catch (err) {
          console.error(err);
        }
      }
    });
  }

  if (lsRefresh) lsRefresh.addEventListener("click", lsLoadTable);
  if (lsNew) lsNew.addEventListener("click", () => lsOpenForm(null));
  if (lsCancel) lsCancel.addEventListener("click", lsCloseForm);
  if (lsSave)
    lsSave.addEventListener("click", async (e) => {
      e.preventDefault();
      const id = lsId.value.trim();
      const payload = {
        name: lsName.value.trim(),
        email: lsEmail.value.trim() || null,
        age: lsAge.value === "" ? null : Number(lsAge.value),
      };
      try {
        if (id) {
          const res = await fetch("/users/" + encodeURIComponent(id), {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          lsOut.textContent = JSON.stringify(data, null, 2);
        } else {
          const res = await fetch("/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json();
          lsOut.textContent = JSON.stringify(data, null, 2);
        }
        await lsLoadTable();
      } catch (err) {
        lsOut.textContent = "Error: " + err.message;
      }
    });

  // initial load for less-simple table
  lsLoadTable();
});
