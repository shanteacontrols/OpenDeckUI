FROM ubuntu:23.04

ARG WGET_ARGS="-q --show-progress --progress=bar:force:noscroll"

RUN \
apt-get update && \
DEBIAN_FRONTEND=noninteractive apt-get install --no-install-recommends -y \
ca-certificates \
curl \
git \
make \
zip \
&& rm -rf /var/lib/apt/lists/*

# Disable password prompt for sudo commands
RUN echo '%sudo ALL=(ALL) NOPASSWD:ALL' >> /etc/sudoers
RUN echo "alias mkc='make clean'" >> /home/ubuntu/.bashrc

# Run everything below as $user
USER ubuntu
WORKDIR /home/ubuntu

RUN \
cd && \
git clone https://github.com/nvm-sh/nvm && \
cd nvm && \
git checkout v0.39.5 && \
./install.sh && \
cd .. && \
rm -rf nvm

RUN \
export NVM_DIR="$HOME/.nvm" && \
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
nvm install 16.20.2 && \
npm install -g electron-packager yarn

ADD .devcontainer/.git_branch_bash /home/ubuntu/.git_branch_bash
RUN echo "source ~/.git_branch_bash" >> ~/.bashrc