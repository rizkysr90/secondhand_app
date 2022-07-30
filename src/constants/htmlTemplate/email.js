const new_user_template = `<table width="100%" cellpadding="0" cellspacing="0" border="0">
<tbody>
  <tr>
    <td width="100%">
      <div style="max-width:600px;Margin:0 auto">
        <table
          align="center"
          cellpadding="0"
          cellspacing="0"
          style="border-spacing:0;font-family:gt-eesti,ArialMT,Helvetica,Arial,sans-serif;Margin:0 auto;padding:24px;width:100%;max-width:500px"
        >
          <tbody>
            
            </tr>
            <tr>
              <td style="text-align:justify;word-break:break-word">
                <table style="margin-bottom:20px;width:100%" width="100%">
                  <tbody>
                    <tr>
                      <td>
                        <table
                          style="width:100%;margin-bottom:20px"
                          width="100%"
                          cellpadding="0"
                          cellspacing="0"
                        >
                          <tbody>
                            <tr>
                              <td>
                                <strong style="font-family:Helvetica,Arial,sans-serif;color:#234567">Hi <%= user %>, </strong>
                                
                                <h1
                                  style="font-size:18px;line-height:30px;color:#054752;word-break:normal"
                                >
                                Welcome to Secondhand! Please confirm your email.
                                </h1>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td>
                        <center>
                          <table
                            style="background-color:transparent;margin-bottom:20px;table-layout:fixed"
                            align="center"
                            width=""
                            cellspacing="0"
                            cellpadding="0"
                          >
                            <tbody>
                              <tr>
                                <td
                                  style="background-color:#00aff5;color:#fff;text-align:center;border-radius:48px;padding:16px 24px;border-color:transparent;font-weight:bold;font-size:16px;line-height:1"
                                >
                                    <a style=color:#fff; href = "<%= url %>" target = "_blank">Click Here</a>
                                </td>
                              </tr>
                              <tr >
                                <td >
                                  <p style="margin-top:20px;">Thank you for your registration in Secondhand</p>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </center>
                      </td>

                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td></td>
            </tr>
            <tr>
              <td>
                <table width="100%" style="margin-bottom:20px;width:100%">
                  <tbody>
                    <tr>
                      <td width="100%">
                        <div
                          style="width:100%;height:1px;background-color:#ddd"
                          color="#DDD"
                          width="100%"
                        ></div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>

            <tr>
              <td style="text-align:center">
              </td>
            </tr>
            <tr>
              <td style="text-align:center;font-size:13px">
                <a
                  href="#"
                  style="color:#00aff5"
                  target="_blank"
                >
                  Secondhand
                </a>
                <span style="color:#00aff5">|</span>
                <a
                  href="#"
                  style="color:#00aff5"
                  target="_blank"
                >
                  FAQ
                </a>
              </td>
            </tr>
            <tr>
              <td style="text-align:center">
                <table
                  style="max-width:100%;width:100%;text-align:center;font-family:ArialMT,Arial,sans-serif"
                  cellspacing="0"
                  cellpadding="0"
                >
                  <tbody>
                    <tr>
                      <td style="text-align:center">
                        <p
                          style="font-size:10px;color:#708c91;text-align:center;padding:0;margin-top:10px;margin-bottom:2px"
                        >
                          This email was sent to you automaticly (Do not reply)
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </td>
  </tr>
</tbody>
</table>`

module.exports = {
  new_user_template
}