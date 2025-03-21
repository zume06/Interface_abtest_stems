$(document).ready(function () {
    Array.prototype.shuffle = function () {
        var i = this.length;
        while (i) {
            var j = Math.floor(Math.random() * i);
            var t = this[--i];
            this[i] = this[j];
            this[j] = t;
        }
        return this;
    }

    function invalid_enter() {
        if (window.event.keyCode == 13) {
            return false;
        }
    }

    function start_experiment() {
        // get user name
        var name = document.getElementById("name").value.replace(" ", "_");
        if (name == "") {
            alert("Please enter your name.");
            return false;
        }
        Display();
        outfile = `mixquery_2025sp_abtest_stems_${name}.csv`;
        init();

    }
    function Display() {
        document.getElementById("Display1").style.display = "none";
        document.getElementById("Display2").style.display = "block";
    }

    function setButton() {
        radio_checked0 = false;
        radio_checked1 = false;
        if (num_query > 2) {
            radio_checked2 = false;
        } else {
            radio_checked2 = true;
        };

        $(".radio_btn0").prop("checked", false);
        $(".radio_btn1").prop("checked", false);
        $(".radio_btn2").prop("checked", false);
        if (n == 0) {
            $("#prev").prop("disabled", true);
        }
        else {
            $("#prev").prop("disabled", false);
        }
        $("#next").prop("disabled", true);
        $("#finish").prop("disabled", true);
    }

    function setButtonPrev() {
        $(".radio_btn0").prop("checked", false);
        $(".radio_btn1").prop("checked", false);
        $(".radio_btn2").prop("checked", false);
        for (var i = 0; i < 3; i++) {
            if (result[n][i] !== undefined) {
                var choice_prev = result[n][i][3];
                $(`#radio_${choice_prev}${i}`).prop("checked", true);
            }
        }
        radio_checked0 = true;
        radio_checked1 = true;
        radio_checked2 = true;
        delete result[n];
        if (n == 0) {
            $("#prev").prop("disabled", true);
        }
        else {
            $("#prev").prop("disabled", false);
        }
        $("#next").prop("disabled", false);
        $("#finish").prop("disabled", true);

    }

    function evalRecord() {
        var test_no_ = set_no_array[n];
        result[n] = []
        for (var i = 0; i < choices.length; i++) {
            result[n].push([test_no_, file_paths[i]["a"], file_paths[i]["b"], choices[i], truths[i]])
        }
    }

    function setAudio() {
        $("#page").text(`${n + 1}/${set_no_array.length}`);
        var test_no = set_no_array[n]
        num_query = set_dict[test_no]["num_query"];
        file_paths = [];
        truths = [];
        for (var i = 0; i < num_query; i++) {
            $(`#inst_display${i}`).text(set_dict[test_no][`ab${i}`]["inst"]);
            $(`#play_query${i}_a`).html(`A: <br><audio src="${set_dict[test_no][`ab${i}`]["a"]}" controls preload="auto"></audio>`);
            $(`#play_query${i}_b`).html(`B: <br><audio src="${set_dict[test_no][`ab${i}`]["b"]}" controls preload="auto"></audio>`);
            file_paths.push({ "a": set_dict[test_no][`ab${i}`]["a"], "b": set_dict[test_no][`ab${i}`]["b"] });
            truths.push(set_dict[test_no][`ab${i}`]["true"]);
        }
        if (num_query < 3) {
            $("#radio-container2").css("display", "none");
        } else {
            $("#radio-container2").css("display", "block");
        };

        $(`#play_retrieved`).html(`<b>Song</b>:<br><audio src="${set_dict[test_no]["retrieved"]}" controls preload="auto"></audio>`);

    }

    function exportCSV() {
        var csvData = "";
        csvData += "test_id,path_a,path_b,choice,true\r\n";
        Object.keys(result).forEach(key => {
            var result_lst = result[key];
            for (var i = 0; i < result_lst.length; i++) {
                csvData += `${result_lst[i][0]},${result_lst[i][1]},${result_lst[i][2]},${result_lst[i][3]},${result_lst[i][4]}\r\n`;
            }
        });

        const link = document.createElement("a");
        document.body.appendChild(link);
        link.style = "display:none";
        const blob = new Blob([csvData], { type: "octet/stream" });
        const url = window.URL.createObjectURL(blob);
        link.href = url;
        link.download = outfile;
        link.click();
        window.URL.revokeObjectURL(url);
        link.parentNode.removeChild(link);
    }

    function init() {
        n = 0;
        choices = [];
        setAudio();
        setButton();
    }

    function next() {
        evalRecord();
        n++;
        choices = [];
        setAudio();
        setButton();
    }

    function prev() {
        n--;
        setAudio();
        setButtonPrev();
    }

    function finish() {
        evalRecord();
        n++;
        exportCSV();
    }

    function ansCheck() {
        if ((radio_checked0 == true) && (radio_checked1 == true) && (radio_checked2 == true)) {
            if (n == (set_no_array.length - 1)) {
                $("#finish").prop("disabled", false);
            }
            else {
                $("#next").prop("disabled", false);
            }
        }
    }

    let set_dict;
    let n = 0;
    let result = {};
    let choices;
    let set_no_array = [];
    let outfile;
    let file_paths = {}
    let truths;
    let radio_checked0;
    let radio_checked1;
    let radio_checked2;
    let choice0;
    let choice1;
    let choice2;
    let num_query;

    $.getJSON("./data/file_list.json", function (d) {
        set_dict = d;
        for (let i = 0; i < Object.keys(set_dict).length; i++) {
            set_no_array.push(i);
        }
        set_no_array.shuffle();
        console.log("set_no_array", set_no_array);
    });


    $("#start").on("click", function () {
        start_experiment();
    });

    $("#next").on("click", function () {
        next();
    });

    $("#prev").on("click", function () {
        prev();
    });

    $("#finish").on("click", function () {
        finish();
    });

    $(".radio_btn0").on("click", function () {
        radio_checked0 = true;
        $(".radio_btn0").not(this).prop("checked", false);
        ansCheck();
        choice0 = $(this).attr("score");
        if (num_query > 2) {
            choices = [choice0, choice1, choice2];
        } else {
            choices = [choice0, choice1];
        };
    });
    $(".radio_btn1").on("click", function () {
        radio_checked1 = true;
        $(".radio_btn1").not(this).prop("checked", false);
        ansCheck();
        choice1 = $(this).attr("score");
        if (num_query > 2) {
            choices = [choice0, choice1, choice2];
        } else {
            choices = [choice0, choice1];
        };
    });
    $(".radio_btn2").on("click", function () {
        radio_checked2 = true;
        $(".radio_btn2").not(this).prop("checked", false);
        ansCheck();
        choice2 = $(this).attr("score");
        if (num_query > 2) {
            choices = [choice0, choice1, choice2];
        } else {
            choices = [choice0, choice1];
        };
    });


});