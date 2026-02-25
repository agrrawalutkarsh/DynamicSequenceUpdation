// this service must be present in the NEO environment

function handlePost(){
    var body, parsedBody, conn, q1, pstmt, rs, output = {};
    
    conn = $.db.getConnection();
    body = $.request.body ? $.request.body.asString() : null;
    
    if(!body){
        throw 'Invalid body';
    }

    parsedBody = JSON.parse($.request.body.asString());

    q1 = ' SELECT SEQUENCE_NAME, START_NUMBER, INCREMENT_BY FROM "SYS"."SEQUENCES" WHERE RESET_BY_QUERY IS NULL AND SCHEMA_NAME = \'enter_schema_name_here\' ORDER BY SEQUENCE_OID LIMIT 1 OFFSET ? ';
    pstmt = conn.prepareStatement(q1);
    pstmt.setInteger(1, parsedBody.offset);
    rs = pstmt.executeQuery();

    if(rs.next()){
        output.SEQUENCE_NAME = rs.getNString(1);
        output.START_NUMBER = rs.getNString(2);
        output.INCREMENT_BY = rs.getNString(3);
    } else{
        output.SEQUENCE_NAME = '';
        output.START_NUMBER = '';
        output.INCREMENT_BY = '';
        output.status = 'Completed';
    }
    
    $.response.setBody(JSON.stringify(output));
    $.response.status = $.net.http.OK;
}


//Function for validation of input. Returns true/false for valid/invalid inputs
function validateInput() {
	return true;
}

//  Request process
function processRequest() {
	if (validateInput()) {
		try {
			switch ($.request.method) {
				case $.net.http.POST: // POST method is used.
					handlePost();
					break;
				default:
					$.response.status = $.net.http.METHOD_NOT_ALLOWED;
					$.response.setBody("Wrong request method");
					break;
			}
			$.response.contentType = "application/json"; // Setting content type to application/json
		} catch (e) {
			$.response.setBody("Failed to execute action: " + e.toString());
		}
	}
} //Call request processing
processRequest();