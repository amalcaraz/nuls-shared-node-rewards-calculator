FROM node:8.11.3
LABEL maintainer "Angel <amalcaraz89@gmail.com>"

# Update system dependencies
RUN apt-get update && \
    apt-get -y install \
    nano \
    vim \
    sudo \
    apt-transport-https

# copy project folder
WORKDIR /code

USER node

EXPOSE 8080
ENTRYPOINT [ "./environment/entry.sh" ]
CMD ["dev"]
