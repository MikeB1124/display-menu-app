package configuration

import (
	"io/ioutil"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type Configuration struct {
	Username string   `yaml:"username"`
	Password string   `yaml:"password"`
	WLIPs    []string `yaml:"wlips"`
}

var Config Configuration

func Init() {
	username := os.Getenv("SERVER_USERNAME")
	password := os.Getenv("SERVER_PASSWORD")
	wlips := []string{"23.243.244.219"}
	if username == "" || password == "" {
		yamlFile, err := ioutil.ReadFile("C:/Users/Stephen Balian/Desktop/2022-dev-projects/Golang/display-menu-app/config.yaml")

		if err != nil {
			log.Printf("yamlFile.Get err   #%v ", err)
		}
		err = yaml.Unmarshal(yamlFile, &Config)
		if err != nil {
			log.Fatalf("Unmarshal: %v", err)
		}
	} else {
		Config.Username = username
		Config.Password = password
		Config.WLIPs = wlips
	}

}
