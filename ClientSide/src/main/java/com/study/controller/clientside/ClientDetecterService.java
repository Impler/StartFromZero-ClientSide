package com.study.controller.clientside;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ClientDetecterService
 */
public class ClientDetecterService extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public ClientDetecterService() {
        super();
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String ip = NetUtil.getRemoteIPAddress(request);
		String macAddress = NetUtil.getMacAddress(ip, NetUtil.getClientOSType(request.getHeader("user-agent")));
		String accept = request.getHeader("accept");
		String acceptLan = request.getHeader("accept-language");
		String acceptEnc = request.getHeader("accept-encoding");
		StringBuffer res = new StringBuffer();
		res.append("{\"ip\":\"").append(ip).append("\",\"macAddress\":\"")
				.append(macAddress).append("\",\"accept\":\"").append(accept)
				.append("\",\"acceptLanguage\":\"").append(acceptLan)
				.append("\",\"acceptEncoding\":\"").append(acceptEnc).append("\"}");
		response.getWriter().println(res.toString());
	}

}
