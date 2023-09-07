package authservice

import (
	"github.com/MikeB1124/display-menu-app/server/configuration"
)

func IsValidUser(u string, p string) bool {
	return u == configuration.Config.Username && p == configuration.Config.Password
}

func WhiteListedIP(ip string) bool {
	for _, WLip := range configuration.Config.WLIPs {
		if ip == WLip {
			return true
		}
	}
	return false
}
