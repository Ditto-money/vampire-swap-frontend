www:
	@python2 -m SimpleHTTPServer 3001

prd:
	@git reset --hard HEAD^
	@git pull

.PHONY: www prd