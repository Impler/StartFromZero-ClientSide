package com.study.controller.clientside;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

public class NetUtil {

	public static String callCmd(String[]... cmds) {
		String result = "";
		try {
			if (cmds.length > 0) {
				Runtime rt = Runtime.getRuntime();
				Process proc = null;
				for(int i=0; i<cmds.length; i++){
					proc = rt.exec(cmds[i]);
				}
				InputStreamReader is = new InputStreamReader(proc.getInputStream());
				BufferedReader br = new BufferedReader(is);
				String line = "";
				while ((line = br.readLine()) != null) {
					result += line;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	/**
	 * @param ip 目标ip,一般在局域网内
	 * @param sourceString 命令处理的结果字符串
	 * @param macSeparator mac分隔符号
	 * @return mac地址，用上面的分隔符号表示
	 */
	public static String filterMacAddress(final String ip,
			final String sourceString, final String macSeparator) {
		String result = "";
		String regExp = "((([0-9,A-F,a-f]{1,2}" + macSeparator
				+ "){1,5})[0-9,A-F,a-f]{1,2})";
		Pattern pattern = Pattern.compile(regExp);
		Matcher matcher = pattern.matcher(sourceString);
		while (matcher.find()) {
			result = matcher.group(1);
			if (sourceString.indexOf(ip) <= sourceString.lastIndexOf(matcher.group(1))) {
				break; // 如果有多个IP,只匹配本IP对应的Mac.
			}
		}
		return result;
	}

	public static String getMacInWindows(final String ip) {
		String result = "";
		String[] cmd = { "cmd", "/c", "ping " + ip };
		String[] another = { "cmd", "/c", "arp -a" };
		String cmdResult = callCmd(cmd, another);
		result = filterMacAddress(ip, cmdResult, "-");
		return result;
	}

	public static String getMacInLinux(final String ip) {
		String result = "";
		String[] cmd = { "/bin/sh", "-c", "ping " + ip + " -c 2 && arp -a" };
		String cmdResult = callCmd(cmd);
		result = filterMacAddress(ip, cmdResult, ":");
		return result;
	}

	public static String getMacAddress(String ip, OSTypeEnum type) {
		String macAddress = "";
		switch (type) {
		case WINDOWS:
			macAddress = getMacInWindows(ip);
			break;
		case LINUX:
			macAddress = getMacInLinux(ip);
			break;
		case MAC:
		case UNIX:
		case UNKNOWN:
			;
			break;
		}
		return macAddress;
	}

	public static OSTypeEnum getClientOSType(String userAgent) {
		
		String tmpAgent = userAgent.toLowerCase();
		if (tmpAgent.contains("windows")) {
			return OSTypeEnum.WINDOWS;
		} else if (tmpAgent.contains("mac")) {
			return OSTypeEnum.MAC;
		} else if (tmpAgent.contains("linux")) {
			return OSTypeEnum.LINUX;
		} else {
			return OSTypeEnum.UNKNOWN;
		}
	}
	
	public static String getRemoteIPAddress(HttpServletRequest request) {
		
		String ip = request.getHeader("x-forwarded-for");

		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getHeader("Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getHeader("WL-Proxy-Client-IP");
		}
		if (ip == null || ip.length() == 0 || ip.equalsIgnoreCase("unknown")) {
			ip = request.getRemoteAddr();
		}
		return null == ip ? ip : ip.split(",")[0].trim();
	}
	
	public static void main(String[] args) {
		String mac = getMacAddress("172.30.18.103", OSTypeEnum.WINDOWS);
		System.out.println("mac:" + mac);
	}

	
	public static enum OSTypeEnum{
		WINDOWS, MAC, LINUX, UNIX, UNKNOWN;
	}

}