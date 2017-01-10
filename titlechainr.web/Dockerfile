FROM ulexus/meteor:build

#dependencies for titlemain, pdfimages, tesseract, and eris
RUN apt-get update && apt-get install -y poppler-utils tesseract-ocr
RUN curl -L https://github.com/eris-ltd/eris-cli/releases/download/v0.11.4/eris_0.11.4_linux_amd64.tar.gz > eris.tar.gz && \
	tar -xvf eris.tar.gz && \
	mv eris_0.11.4_linux_amd64/eris /usr/local/bin