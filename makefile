MOCHA_OPTS = -cd -t 20000
REPORTER = nyan

check: test jslint

test:
    @NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS)

jslint:
	rm -f ./jslint.log
	jslint ./*.js ./*.json ./test/*.js ./config/*.js ./controllers/*.js ./routes/*.js ./lib/*.js --nomen >> ./jslint.log

clean:
	rm -f ./jslint.log

.PHONY: test jslint check clean
