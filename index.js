const axios = require("axios");
const path = require("path");
const fs = require("fs");

async function fetchData() {
    let offset = 0;
    let status = "Not Completed";
    while (status !== "Completed") {
        await axios
            .post(
                "neo_db_path_to_this_service/GetSequenceDetails.xsjs",
                {
                    offset,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    auth: {
                        username: "enter_username_here",
                        password: "enter_password_here",
                    },
                }
            )
            .then((response) => {
                status = response.data.status;
                let start_number = response.data.START_NUMBER;
                let sequence_name = response.data.SEQUENCE_NAME;
                let increment_by = response.data.INCREMENT_BY;
                console.log(`Processing sequence: ${sequence_name}`);

                if (start_number && sequence_name && increment_by) {
                    let query = 'SEQUENCE "' + sequence_name + '" START WITH ' + start_number + ' INCREMENT BY ' + increment_by;
                    const fileName = `${sequence_name?.trim().toUpperCase()}.hdbsequence`;
                    const filePath = path.join(__dirname, "sequences", fileName);

                    fs.writeFileSync(filePath, query, "utf8");
                    console.log(`File created: ${filePath}`);
                } else {
                    throw new Error(sequence_name || 'invalidSeqName');
                }
            })
            .catch((error) => {
                console.error("Error fetching data:", error.message);
                if (error.message) {
                    const filePath = path.join(__dirname, "errorSequences", error.message);

                    fs.writeFileSync(filePath, "error creating sequence", "utf8");
                    console.log(`File created: ${filePath}`);
                }
            });
        offset++;
    }
}

fetchData();