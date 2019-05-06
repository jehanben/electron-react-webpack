import React from "react";
// @material-ui/core components
import withStyles from "@material-ui/core/styles/withStyles";

const styles = theme => ({});

function DockerCompose(props) {

  var Docker = require('dockerode');

  var docker = new Docker({
    socketPath: '/var/run/docker.sock'
  });


  docker.buildImage('./Dockerfile.tar.xz', {
    t: 'nginxphpdocker/app',
    rm: true,
    buildargs: {
      "buildtime_version":"7.2"
    },
  }, function(err, stream) {
    if (err) return;

    stream.pipe(process.stdout, {
      end: true
    });

    stream.on('end', function() {
      done();
    });
  });

  function done() {
    console.log("in");
    docker.createContainer({
      Image: 'nginxphpdocker/app',
      ExposedPorts: {
        "80/tcp": {}
      },
      HostConfig: {
        Privileged: false,
        Binds: [
          "/home/jehan/work/MSC/Project/sampleapp/application:/var/www/html/public"
        ],
        PortBindings: {
          "80/tcp": [
            { "HostPort": "9000" }
          ]
        },
      }
    }, function(err, container) {
      container.attach({
        stream: true,
        stdout: true,
        stderr: true,
        tty: true
      }, function(err, stream) {
        if (err) return;

        stream.pipe(process.stdout);

        container.start(function(err, data) {
          if (err) return;
        });
      });
    });
  }

  return (
    <div>
      Test
    </div>
  )
}

export default withStyles(styles)(DockerCompose);
