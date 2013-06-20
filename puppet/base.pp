node default {
	##### APACHE

  	exec { "apt-update":
  	  command     => "/usr/bin/apt-get update"
  	}
	
	package {'apache2': 
		ensure => present,
		require => Exec['apt-update']
	}
	
	
	service { "apache2":
		ensure => running,
		require => [
			Package["apache2"], 
			File["/etc/apache2/sites-available/default"]
		]
	}
	
    file { "/etc/apache2/sites-available/default":
      source => "/vagrant/puppet/default.vhost",
      owner => root,
      group => root,
      require => Package["apache2"]
    }
}
