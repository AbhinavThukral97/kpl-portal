$(document).ready(function() {
  //For Mobile Nav
  let navOpen = false;

  $(".menu-button").click(function() {
    if (!navOpen) {
      $(".dashboard-nav").css("left", "0px");
      $(".menu-button").css("transform", "translate(100%, 0) rotate(0deg)");
      navOpen = true;
    } else {
      $(".dashboard-nav").css("left", "-250px");
      $(".menu-button").css("transform", "translate(100%, 0) rotate(180deg)");
      navOpen = false;
    }
  });

  //For Reports and School Search Table
  $(".search-bar").keyup(function(e) {
    searchTable($(this).val());
  });

  function searchTable(value) {
    $("table tr.row").each(function() {
      let found = false;
      $(this).each(function() {
        if (
          $(this)
            .text()
            .toLowerCase()
            .indexOf(value.toLowerCase()) > -1
        ) {
          found = true;
        }
      });
      if (found) {
        $(this).show();
      } else {
        $(this).hide();
      }
    });
  }

  //For Accounts Page
  var enableDelete = 0;
  $("a.delete-link").css("display", "none");
  $("button.enable-delete").click(function() {
    if (enableDelete == 0) {
      $("a.delete-link").css("display", "block");
      $("button.enable-delete").css("background", "rgb(52, 175, 125)");
      $("button.enable-delete").html(
        '<i class="fas fa-user-slash"></i> Disable Deletion'
      );
      enableDelete = 1;
    } else {
      $("a.delete-link").css("display", "none");
      $("button.enable-delete").css("background", "rgb(207, 82, 82)");
      $("button.enable-delete").html(
        '<i class="fas fa-user-slash"></i> Enable Deletion'
      );
      enableDelete = 0;
    }
  });

  //For CSV Export
  function downloadCSV(table) {
    let csv = "";
    table.find("tr").each(function() {
      let tableRow = [];
      $(this)
        .filter(":visible")
        .find("th")
        .each(function() {
          tableRow.push(
            $(this)
              .text()
              .replace(/(^\s+|\s+$)/g, "")
          );
        });
      if (tableRow.length < 1) {
        $(this)
          .filter(":visible")
          .find("td")
          .each(function() {
            tableRow.push(
              $(this)
                .text()
                .replace(/(^\s+|\s+$)/g, "")
            );
          });
      }
      console.log(tableRow.slice(0, tableRow.length));
      csv += tableRow.slice(0, tableRow.length).join(",");
      csv += "\n";
    });

    if (csv.length > 0) {
      let hiddenElement = document.createElement("a");
      hiddenElement.href = "data:text/csv;charset=utf-8," + encodeURI(csv);
      hiddenElement.target = "_blank";
      hiddenElement.download = "data.csv";
      hiddenElement.click();
    }

    return csv;
  }

  downloadCSV($("table.todownload"));
});
