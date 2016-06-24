package com.study.controller.clientside;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class ClientDetecterServlet
 */
public class ClientDetecterServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public ClientDetecterServlet() {
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
		
		// request header信息
		@SuppressWarnings("unchecked")
		Enumeration<String> headerNames = request.getHeaderNames();
		/**
		 * host : localhost:8080
		 * user-agent : Mozilla/5.0 (Windows NT 6.1; WOW64; rv:45.0) Gecko/20100101 Firefox/45.0
		 */
		 //accept : text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
		 /** 
		  * accept-language : zh-CN,zh;q=0.8,en-US;q=0.5,en;q=0.3
		  * accept-encoding : gzip, deflate
		  * connection : keep-alive
		  * cache-control : max-age=0
		  */
		while(null != headerNames && headerNames.hasMoreElements()){
			String headerName = headerNames.nextElement();
			System.out.println(headerName + " : " + request.getHeader(headerName));
		}
		
		// client IP
		String ip = NetUtil.getRemoteIPAddress(request);
		System.out.println("client ip: " + ip);
		// client mac address
		System.out.println(NetUtil.getMacAddress(ip, NetUtil.getClientOSType(request.getHeader("user-agent"))));
	}
	
	
}
