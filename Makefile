www:
	@python2 -m SimpleHTTPServer 3001

prd:
	@git pull

.PHONY: www prd